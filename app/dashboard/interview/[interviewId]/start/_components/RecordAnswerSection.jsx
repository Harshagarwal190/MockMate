"use client";
import Webcam from "react-webcam";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useUser } from "@clerk/nextjs";
import { UserAnswer } from "@/utils/schema";
import moment from "moment";
import { db } from "@/utils/db";

// ✅ Initialize AI Model
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const { isRecording, results, startSpeechToText, stopSpeechToText,setResults } =
    useSpeechToText({
      continuous: true,
      useLegacyResults: false,
    });

  // ✅ Capture latest transcript from speech-to-text
  useEffect(() => {
    if (results.length > 0) {
      setUserAnswer(results[results.length - 1]?.transcript);
    }
  }, [results]);

  // ✅ Auto-update feedback when recording stops & answer is valid
  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  // ✅ Start/Stop Recording
  const StartStopRecording = () => {
    isRecording ? stopSpeechToText() : startSpeechToText();
  };

  // ✅ Fetch AI Feedback & Store Answer
  const UpdateUserAnswer = async () => {
    console.log("User Answer:", userAnswer);
    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, 
        User Answer: ${userAnswer}. 
        Please provide a JSON response in the following format:
        {
            "rating": "A score from 1 to 10",
            "feedback": "A short feedback of 3-5 lines"
        }`;

    try {
      console.log("Sending Prompt to AI:", feedbackPrompt);

      // ✅ Get AI response
      const result = await model.generateContent(feedbackPrompt);
      console.log("Raw AI Response Object:", result);

      // ✅ Extract AI response content
      let rawResponse =
        result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawResponse) throw new Error("AI Response is empty or undefined");

      console.log("Raw AI Response Text:", rawResponse);

      // ✅ Remove markdown formatting (` ```json ` and ` ``` `)
      rawResponse = rawResponse.replace(/```json|```/g, "").trim();

      // ✅ Attempt JSON parsing
      let JsonFeedbackResp;
      try {
        JsonFeedbackResp = JSON.parse(rawResponse);
      } catch (jsonError) {
        console.error("JSON Parsing Error:", jsonError);
        toast("Error parsing AI feedback. Check console for details.");
        return;
      }

      console.log("Parsed AI Feedback:", JsonFeedbackResp);

      if (!JsonFeedbackResp.feedback || !JsonFeedbackResp.rating) {
        console.error("AI Response Missing Fields:", JsonFeedbackResp);
        toast("AI response is incomplete. Please try again.");
        return;
      }

      // ✅ Save response to database
      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewData?.mock_id,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp.feedback,
        rating: JsonFeedbackResp.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("YYYY-MM-DD"),
      });

      if (resp) {
        toast("User Answer Saved Successfully");
      }

      setUserAnswer("");
      setResults([]);
    } catch (error) {
      console.error("Error fetching AI feedback:", error);
      toast("Failed to get AI feedback. Check console for details.");
    } finally {
      setLoading(false);
      setResults([]);
    }
  };

  return (
    <div className="flex items-center justify-between flex-col">
      {/* ✅ Webcam Section */}
      <div className="flex flex-col mt-20 justify-center items-center rounded-lg p-5 bg-black">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
           alt="Webcam preview"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      {/* ✅ Record Button */}
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 gap-2">
            <Mic /> Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
    </div>
  );
}

export default RecordAnswerSection;

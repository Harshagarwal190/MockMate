
"use client";
import { useEffect, useState, use } from "react";
import { mockInterview } from "@/utils/schema";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StartInterview({ params: paramsPromise }) {
    const params = use(paramsPromise); // ✅ Unwrap params correctly
    const interviewId = params?.interviewId; // ✅ Extract interviewId safely

    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState(null);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    useEffect(() => {
        if (interviewId) {
            GetInterviewDetails(interviewId);
        }
    }, [interviewId]);

    const GetInterviewDetails = async (interviewId) => {
        try {
            console.log("Fetching interview details for:", interviewId);

            const result = await db
                .select()
                .from(mockInterview)
                .where(eq(mockInterview.mock_id, interviewId));

            console.log("DB Query Result:", result); // ✅ Log the database response

            if (!result.length) {
                console.error("No interview data found!");
                return;
            }

            // 🔥 Ensure jsonMockResp is valid JSON before parsing
            if (!result[0]?.jsonMockResp) {
                console.error("jsonMockResp is missing or null!");
                return;
            }

            try {
                const jsonMockResp = JSON.parse(result[0].jsonMockResp);
                console.log("Parsed Questions & Answers:", jsonMockResp); // ✅ Log the parsed questions & answers

                setMockInterviewQuestion(jsonMockResp);
                setInterviewData(result[0]);
            } catch (parseError) {
                console.error("Error parsing jsonMockResp:", parseError);
            }

        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-10">
                {/* Question */}
                <QuestionsSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                />
                {/* vedio/Audio Recording */}
                <RecordAnswerSection
                    mockInterviewQuestion={mockInterviewQuestion}
                    activeQuestionIndex={activeQuestionIndex}
                    interviewData={interviewData}
                />
            </div>
            <div className="flex justify-end gap-6 ">
              {activeQuestionIndex>0 && 
              <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)} className="bg-blue-500"> Previous Question</Button> }
              {activeQuestionIndex!=mockInterviewQuestion?.length-1 && 
               <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)} className="bg-blue-500"> Next Question</Button>}
              {activeQuestionIndex==mockInterviewQuestion?.length-1 &&  
              <Link href={`/dashboard/interview/${interviewId}/feedback`}>
              <Button className="bg-blue-500"> End Interview</Button>
              </Link>}
            </div>
        </div>
    );
}

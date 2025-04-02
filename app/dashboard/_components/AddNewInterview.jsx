"use client";
import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { mockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { useRouter } from "next/navigation";

const API_KEY = "AIzaSyAh1gC2gD53eNnMionD6rKkaPML41mZSS8";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

function AddNewInterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDesc, setJobDesc] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const { user } = useUser();
    const router = useRouter();

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        console.log("Submitting Data:", { jobPosition, jobDesc, jobExperience });

        // Generate interview questions
        const inputPrompt = `Job Position: ${jobPosition}, Job Desc: ${jobDesc}, Years of Experience: ${jobExperience}. Based on this information, please generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format. Provide 'question' and 'answer' fields in the JSON response.`;

        try {
            const result = await model.generateContent(inputPrompt);
            const rawResponse = await result.response.text();

            const cleanedResponse = rawResponse.replace('```json', '').replace('```', '');

            let parsedJson;
            try {
                parsedJson = JSON.parse(cleanedResponse);
                console.log("Parsed JSON Response:", parsedJson);
            } catch (jsonError) {
                console.error("JSON Parsing Error:", jsonError);
                setLoading(false);
                return;
            }

            if (parsedJson) {
                const mockId = uuidv4();
                const createdAt = moment().format("YYYY-MM-DD");
                const createdBy = user?.primaryEmailAddress?.emailAddress;

                // ✅ Ensure required fields exist before inserting
                if (!jobPosition || !jobDesc || !createdBy) {
                    console.error("Error: Missing required fields!", { jobPosition, jobDesc, createdBy });
                    setLoading(false);
                    return;
                }

                console.log("Final Created By:", createdBy);
                console.log("Inserting into DB with Mock ID:", mockId);

                // ✅ Debug: Log full insert object
                const insertData = {
                    mock_id: mockId,
                    jsonMockResp: JSON.stringify(parsedJson),
                    jobExperience: jobExperience,
                    job_position: jobPosition,
                    job_desc: jobDesc,
                    createdBy: String(createdBy), // Ensuring it's a string
                    created_at: new Date(), // ✅ Fix: Proper Date object
                };
                
                console.log("DB Insert Object:", insertData);

                // Insert into DB
                const resp = await db.insert(mockInterview).values(insertData);
                
                console.log("Inserted Response:", resp);
                if (resp && resp.rowCount === 1) {
                    console.log("Successfully inserted Mock ID:", insertData.mock_id);
                    router.push(`/dashboard/interview/${insertData.mock_id}`);
                } else {
                    console.log("No ID returned from DB.");
                }
            }
        } catch (error) {
            console.error("❌ Error during AI Generation or DB Insert:", error);
        }

        setLoading(false);
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="text-lg text-center">+ Add New</h2>
            </div>
            <Dialog open={openDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <div>
                                    <h2>Add details about your job position/role, job description, and years of experience</h2>
                                    <div className="mt-7 my-3">
                                        <label>Job Role/Job Position</label>
                                        <Input
                                            placeholder="Ex. Full Stack Developer"
                                            required
                                            value={jobPosition}
                                            onChange={(e) => setJobPosition(e.target.value)}
                                        />
                                    </div>
                                    <div className="my-3">
                                        <label>Job Description/ Tech Stack</label>
                                        <Textarea
                                            placeholder="Ex. React, Angular, MySQL, etc."
                                            required
                                            value={jobDesc}
                                            onChange={(e) => setJobDesc(e.target.value)}
                                        />
                                    </div>
                                    <div className="my-3">
                                        <label>Years of Experience</label>
                                        <Input
                                            placeholder="Ex. 3"
                                            type="number"
                                            required
                                            value={jobExperience}
                                            onChange={(e) => setJobExperience(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-5 justify-end">
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <LoaderCircle className="animate-spin" /> Generating from AI
                                            </>
                                        ) : (
                                            "Start Interview"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default AddNewInterview;

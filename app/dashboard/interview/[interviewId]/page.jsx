

"use client";  // ✅ This ensures it's a Client Component

import React from 'react';  // ✅ Import React (optional for modern Next.js, but good practice)
import { mockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { db } from '@/utils/db';
import Webcam from 'react-webcam';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const Interview = () => {  // ✅ Ensure this is a valid functional component
    const params = useParams();
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);

    useEffect(() => {
        if (params?.interviewId) {
            GetInterviewDetails(params.interviewId);
        }
    }, [params]);

    const GetInterviewDetails = async (interviewId) => {
        try {
            const result = await db
                .select()
                .from(mockInterview)
                .where(eq(mockInterview.mock_id, interviewId));

            console.log("Fetched interview data:", result);
            
            if (result.length > 0) {
                setInterviewData(result[0]); // Ensure valid object is set
            } else {
                setInterviewData(null); // Avoid undefined issues
            }
        } catch (error) {
            console.error("Error fetching interview details:", error);
        }
    };

    return (
        <div className='my-10 flex flex-col items-center'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-15'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='p-5 rounded-lg border'>
                        {interviewData ? (
                            <>
                                <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.job_position || "N/A"}</h2>
                                <h2 className='text-lg'><strong>Job Desc:</strong> {interviewData?.job_desc || "N/A"}</h2>
                                <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData?.jobExperience || "N/A"}</h2>
                            </>
                        ) : (
                            <p>Loading interview details...</p>
                        )}
                    </div>
                    
                    <div className='p-5 rounded-lg border-yellow-200 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'>
                            <Lightbulb /> <strong>Information</strong>
                        </h2>
                        <h2 className='mt-3 text-yellow-500'>
                            {process.env.NEXT_PUBLIC_INFORMATION || "No additional information available."}
                        </h2>
                    </div>
                </div>

                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{ height: 300, width: 300 }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant='ghost' className='w-full' onClick={() => setWebCamEnabled(true)}>
                                Enable Webcam and Microphone
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <Link href={`/dashboard/interview/${params?.interviewId}/start`}>
                <Button>Start Interview</Button>
            </Link>
        </div>
    );
}

export default Interview; // ✅ Ensure the default export is a React Component

"use client"
import { db } from '@/utils/db';
import { mockInterview } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react';
import InterviewItemCard from './InterviewItemCard';

function InterviewList() {
    const { user } = useUser();
    const [interviewList, setInterviewList] = useState([]);

    useEffect(() => {
        if (user) {
            GetInterviewList();
        }
    }, [user]);

    const GetInterviewList = async () => {
        try {
            if (!user?.emailAddresses?.length) {
                console.warn("No email found for the user.");
                return;
            }

            const email = user.emailAddresses[0].emailAddress; // Correct email retrieval
            console.log("Fetching interviews for:", email);

            const result = await db
                .select()
                .from(mockInterview)
                .where(eq(mockInterview.createdBy, email))
                .orderBy(desc(mockInterview.id));

            console.log("Fetched Interviews:", result);

            if (result.length === 0) {
                console.warn("No interviews found for this user.");
            }

            setInterviewList(result);
        } catch (error) {
            console.error("Error fetching interviews:", error);
        }
    };

    return (
        <div>
            <h2 className="font-medium text-xl">Previous Mock Interviews</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
                {interviewList.length > 0 ? (
                    interviewList.map((interview,index) => (
                        <InterviewItemCard 
                      interview={interview} 
                      key={index}/>
                    ))
                ) : (
                    <p>No interviews found.</p>
                )}
            </div>
        </div>
    );
}

export default InterviewList;




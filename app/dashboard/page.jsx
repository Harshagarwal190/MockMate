

import React from 'react'
import AddNewInterview from './_components/AddNewInterview'
import InterviewList from './_components/InterviewList'
function Dashboard() {
  return (
    <div>
       <h2 className=' font-bold text-2xl mt-6'> Dashboard</h2>
       <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>

       <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
       </div>

       {/* Previous Interview list */}
       <InterviewList/>
    </div>
  )
}

export default Dashboard
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

function InterviewItemCard({interview}) {

  const router =useRouter();
  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mock_id)
  }

  const onFeedbackPress=()=>{
    router.push('/dashboard/interview/'+interview?.mock_id+'/feedback')
  }
  return (
    <div className='border shadow-sm rounded-lg p-3'>
      <h2 className='font-bold text-blue-600'>{interview?.job_position}</h2>
      <h2 className='text-sm text-gray-600'>{interview?.jobExperience} Years of Experience</h2>
     
      
      <div className='flex justify-between mt-2 gap-5' >

        
        <Button size="sm" variant="outline" 
        onClick={onFeedbackPress}
        >Feedback</Button>
        <Button size="sm" 
        onClick={onStart}
        >Start</Button>
      </div>
      </div>
      
  )
}

export default InterviewItemCard
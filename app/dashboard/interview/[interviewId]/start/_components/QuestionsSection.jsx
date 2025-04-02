// import React from "react";
// import { Lightbulb, Volume2 } from "lucide-react";

// function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
//   const textToSpeech = (text) => {
//     if (window.speechSynthesis) { // ✅ Fixed condition
//       const speech = new SpeechSynthesisUtterance(text);
//       window.speechSynthesis.speak(speech);
//     } else {
//       alert("Your browser doesn't support text to speech");
//     }
//   };

//   return (
//     mockInterviewQuestion && (
//       <div className="p-5 border rounded-lg my-10">
//         <div className="flex flex-col-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
//           {mockInterviewQuestion.map((question, index) => (
//             <h2
//               key={index} // ✅ Added missing key
//               className={`p-2 rounded-full text-xs md:text-sm text-center 
//                 ${activeQuestionIndex === index ? "bg-blue-600 text-white" : "bg-secondary"}`}
//             >
//               Question#{index + 1}
//             </h2>
//           ))}
//         </div>
//         <h2 className="my-5 text:md md:text-lg">
//           {mockInterviewQuestion[activeQuestionIndex]?.question}
//         </h2>

//         {/* Volume button for Text-to-Speech */}
//         <Volume2
//           className="cursor-pointer"
//           onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
//         />

//         <div className="border rounded-lg p-5 bg-blue-100 my-20">
//           <h2 className="flex gap-2 items-center text-blue-700">
//             <Lightbulb />
//             <strong>Note:</strong>
//           </h2>
//           <h2 className="text-sm text-blue-700 my-2 ">
//             {process.env.NEXT_PUBLIC_QUESTION_NOTE}
//           </h2>
//         </div>
//       </div>
//     )
//   );
// }

// export default QuestionsSection;


import React from "react";
import { Lightbulb, Volume2 } from "lucide-react";

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if (window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser doesn't support text to speech");
    }
  };

  return (
    mockInterviewQuestion && (
      <div className="p-5 border rounded-lg my-10">
        {/* Ensure question buttons wrap properly on small screens */}
        <div className="flex flex-wrap gap-3">
          {mockInterviewQuestion.map((question, index) => (
            <h2
              key={index}
              className={`p-2 rounded-full text-xs md:text-sm text-center 
                ${activeQuestionIndex === index ? "bg-blue-600 text-white" : "bg-secondary"}`}
            >
              Question#{index + 1}
            </h2>
          ))}
        </div>

        <h2 className="my-5 text-md md:text-lg">
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>

        {/* Volume button for Text-to-Speech */}
        <Volume2
          className="cursor-pointer"
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
        />

        <div className="border rounded-lg p-5 bg-blue-100 my-20">
          <h2 className="flex gap-2 items-center text-blue-700">
            <Lightbulb />
            <strong>Note:</strong>
          </h2>
          <h2 className="text-sm text-blue-700 my-2 ">
            {process.env.NEXT_PUBLIC_QUESTION_NOTE}
          </h2>
        </div>
      </div>
    )
  );
}

export default QuestionsSection;

import React from 'react';

interface IntroScreenProps {
  onStart: () => void;
}

const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-center text-black flex flex-col justify-between h-full">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-black">Sentence Construction</h1>
        <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 md:mb-10 text-gray-800 leading-relaxed max-w-2xl mx-auto">
          Select the correct words to complete the sentence by arranging
          the provided options in the right order.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div className="border border-gray-200 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-blue-50">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold mb-0 text-sm sm:text-base md:text-lg text-blue-900">Time Per Question</h3>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Fixed</div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-blue-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30 seconds
            </p>
          </div>
          <div className="border border-gray-200 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-green-50">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold mb-0 text-sm sm:text-base md:text-lg text-green-900">Total Questions</h3>
              <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">All Questions</div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-green-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              10 questions
            </p>
          </div>
          <div className="border border-gray-200 p-3 sm:p-4 md:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-yellow-50 sm:col-span-2 md:col-span-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold mb-0 text-sm sm:text-base md:text-lg text-yellow-900">Total Time</h3>
              <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Estimated</div>
            </div>
            <p className="text-lg sm:text-xl md:text-2xl text-yellow-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              5 minutes
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6 sm:mt-8">
        <button 
          className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 md:py-3 border-2 border-blue-500 text-blue-500 rounded-md hover:bg-blue-50 transition-colors text-sm sm:text-base md:text-lg font-medium"
        >
          Back
        </button>
        <button 
          onClick={onStart}
          className="px-4 sm:px-6 md:px-8 lg:px-10 py-2 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm sm:text-base md:text-lg font-medium"
        >
          Start
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
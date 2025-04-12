import React from 'react';

interface FeedbackScreenProps {
  results: {
    prompt: string;
    userAnswer: string[];
    correctAnswer: string[];
    isCorrect: boolean;
  }[];
  onRestart: () => void;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ results, onRestart }) => {
  // Calculate overall score
  const correctAnswersCount = results.filter(result => result.isCorrect).length;
  const totalQuestions = results.length;
  const score = Math.round((correctAnswersCount / totalQuestions) * 100);
  
  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-black h-full flex flex-col">
      <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 mb-4 sm:mb-6">
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-full flex items-center justify-center border-4 sm:border-6 md:border-8 border-transparent"
            style={{
              background: `conic-gradient(
                #38A169 ${score}%, 
                #E2E8F0 0
              )`
            }}
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-600">{score}</span>
            </div>
          </div>
          <div className="absolute bottom-0 right-0 text-xs sm:text-sm text-black">
            Overall Score
          </div>
        </div>
        
        <p className="text-sm sm:text-base md:text-lg text-gray-800 text-center max-w-2xl mb-4 sm:mb-6 md:mb-8 leading-relaxed px-2">
          {score > 80 
            ? "Great job! You've demonstrated excellent sentence construction skills." 
            : score > 50 
              ? "While you correctly formed several sentences, there are a couple of areas where improvement is needed. Pay close attention to sentence structure and word placement to ensure clarity and correctness."
              : "You're making progress, but there's room for improvement. Focus on understanding sentence structure and practice more with word placement to enhance your skills."
          }
        </p>
        
        <button 
          onClick={onRestart}
          className="px-4 py-2 sm:px-6 sm:py-2 md:px-8 md:py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mb-6 sm:mb-8 md:mb-10 text-sm sm:text-base md:text-lg font-medium"
        >
          Go to Dashboard
        </button>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8 w-full max-w-lg mx-auto">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-blue-800 font-semibold text-lg sm:text-xl">{totalQuestions}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Questions</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-green-800 font-semibold text-lg sm:text-xl">{correctAnswersCount}</div>
            <div className="text-xs sm:text-sm text-gray-600">Correct Answers</div>
          </div>
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="text-orange-800 font-semibold text-lg sm:text-xl">{totalQuestions * 30}s</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Time</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-purple-800 font-semibold text-lg sm:text-xl">{correctAnswersCount * 10}</div>
            <div className="text-xs sm:text-sm text-gray-600">Earned Points</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4 sm:space-y-6 md:space-y-8 overflow-y-auto flex-grow pb-4 px-1 sm:px-2">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4">Question Review</h2>
        {results.map((result, index) => (
          <div key={index} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="bg-gray-100 p-3 sm:p-4 md:p-5 border-b">
              <div className="flex justify-between items-center">
                <div className="font-medium text-sm sm:text-base md:text-lg">Prompt {index + 1}/{totalQuestions}</div>
                <div className={`font-semibold text-sm sm:text-base md:text-lg ${result.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                </div>
              </div>
            </div>
            <div className="p-3 sm:p-4 md:p-5">
              <p className="mb-3 sm:mb-4 text-black text-sm sm:text-base md:text-lg leading-relaxed">{result.prompt}</p>
              <div className="mb-3 sm:mb-4">
                <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mb-1 sm:mb-2">Your response</p>
                <p className="text-sm sm:text-base md:text-lg">{result.userAnswer.join(' ')}</p>
              </div>
              {!result.isCorrect && (
                <div>
                  <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium mb-1 sm:mb-2">Correct answer</p>
                  <p className="text-green-700 text-sm sm:text-base md:text-lg">{result.correctAnswer.join(' ')}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackScreen;
import React, { useState, useEffect, useCallback } from 'react';
import Timer from './Timer';

interface SentenceConstructionProps {
  onComplete: (results: any[]) => void;
}

interface Question {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string[];
}

interface ApiResponse {
  status: string;
  data: {
    testId: string;
    questions: Question[];
  };
  message: string;
}

const SentenceConstruction: React.FC<SentenceConstructionProps> = ({ onComplete }) => {
  // Ensure timer starts with correct values
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<(string | null)[]>([]);
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(30); // Default to 30 seconds
  const [results, setResults] = useState<{ 
    prompt: string;
    userAnswer: string[];
    correctAnswer: string[];
    isCorrect: boolean;
  }[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Start paused until questions load
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [allQuestionsSelected, setAllQuestionsSelected] = useState(false);

  // Fetch and randomly select 10 questions from API or local data.json
  useEffect(() => {
    // First try the external API
    fetch('https://projects.harinarayankoiri.com.np/sentence-construction/assets/data.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: ApiResponse) => {
        if (data.status === 'SUCCESS' && data.data.questions) {
          // Randomly select 10 questions from the data
          const allQuestions = [...data.data.questions];
          const shuffled = allQuestions.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 10);
          
          setQuestions(selected);
          setAllQuestionsSelected(true);
          setLoading(false);
          
          // Start the timer once questions are loaded
          console.log("Questions loaded from API, starting timer");
          setTimeRemaining(30);
          setIsTimerRunning(true);
        }
      })
      .catch(error => {
        console.error('Error fetching questions from API, trying local fallback:', error);
        // Fallback to local data.json if API fails
        fetch('/data.json')
          .then(response => response.json())
          .then((data: ApiResponse) => {
            if (data.status === 'SUCCESS' && data.data.questions) {
              const allQuestions = [...data.data.questions];
              const shuffled = allQuestions.sort(() => 0.5 - Math.random());
              const selected = shuffled.slice(0, 10);
              
              setQuestions(selected);
              setAllQuestionsSelected(true);
              setLoading(false);
              
              console.log("Questions loaded from local file, starting timer");
              setTimeRemaining(30);
              setIsTimerRunning(true);
            }
          })
          .catch(fallbackError => {
            console.error('Error fetching questions from local file:', fallbackError);
            setLoading(false);
          });
      });
  }, []);

  const currentQuestion = questions[currentQuestionIndex];
  
  // Initialize the game state for the current question
  useEffect(() => {
    if (currentQuestion && !loading && allQuestionsSelected) {
      console.log("Setting up new question - initializing timer");
      // Always require 4 options to be selected per question
      setSelectedWords(Array(4).fill(null));
      setAvailableOptions([...currentQuestion.options]);
      setTimeRemaining(30);
      setIsTimerRunning(true);
      console.log("Timer should be running now, isTimerRunning =", true);
    }
  }, [currentQuestionIndex, currentQuestion, loading, allQuestionsSelected]);

  // Track total elapsed time
  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => {
        // Track total elapsed time if needed in the future
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

  // Add a debug effect to monitor timer state
  useEffect(() => {
    console.log("Timer state changed: timeRemaining =", timeRemaining, "isTimerRunning =", isTimerRunning);
  }, [timeRemaining, isTimerRunning]);

  // Process the question prompt to identify blanks
  const processPrompt = useCallback((prompt: string) => {
    return prompt.split(' ').map((word, index) => {
      if (word.includes('_______')) {
        const blankIndex = selectedWords.findIndex((_, i) => 
          selectedWords.slice(0, i).filter(w => w !== null).length === 
          prompt.split(' ').slice(0, index).filter(w => w.includes('_______')).length
        );
        
        return (
          <span key={index} className="mx-1 sm:mx-2 my-1 sm:my-2 inline-block">
            {selectedWords[blankIndex] ? (
              <button
                className="px-2 py-1 sm:px-4 sm:py-2 bg-blue-100 border-2 border-blue-300 rounded-md hover:bg-blue-200 text-blue-800 font-medium text-sm sm:text-base md:text-lg transition-colors"
                onClick={() => handleRemoveWord(blankIndex)}
              >
                {selectedWords[blankIndex]}
              </button>
            ) : (
              <span className="px-4 sm:px-8 py-1 sm:py-2 border-b-2 border-gray-400 mx-1 inline-block w-16 sm:w-24 md:w-32"></span>
            )}
          </span>
        );
      }
      return <span key={index} className="mx-1 my-1 inline-block">{word}</span>;
    });
  }, [selectedWords]);

  // Handle timer expiration
  const handleTimerEnd = () => {
    // Time's up - automatically move to the next question
    const filledAnswers = selectedWords.filter(w => w !== null) as string[];
    
    const newResults = [...results, {
      prompt: currentQuestion.question,
      userAnswer: filledAnswers,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: false // Automatically mark as incorrect if time ran out
    }];
    
    setResults(newResults);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      // Reset the timer state here too
      setTimeRemaining(30);
      setIsTimerRunning(true);
    } else {
      // Quiz complete
      onComplete(newResults);
    }
  };

  // Handle selecting a word option
  const handleSelectWord = useCallback((word: string) => {
    const firstEmptyIndex = selectedWords.findIndex(w => w === null);
    if (firstEmptyIndex === -1) return; // All slots are filled
    
    setSelectedWords(prev => {
      const newSelectedWords = [...prev];
      newSelectedWords[firstEmptyIndex] = word;
      return newSelectedWords;
    });
    
    setAvailableOptions(prev => prev.filter(option => option !== word));
  }, [selectedWords]);

  // Handle removing a selected word
  const handleRemoveWord = useCallback((index: number) => {
    if (selectedWords[index] === null) return;
    
    const wordToRemove = selectedWords[index];
    
    setSelectedWords(prev => {
      const newSelectedWords = [...prev];
      newSelectedWords[index] = null;
      return newSelectedWords;
    });
    
    if (wordToRemove) {
      setAvailableOptions(prev => [...prev, wordToRemove]);
    }
  }, [selectedWords]);

  // Check if all 4 options are selected
  const allOptionsSelected = selectedWords.every(word => word !== null);

  // Handle submitting the answer
  const handleSubmit = () => {
    if (!allOptionsSelected) return; // Prevent submission if not all options are selected
    
    console.log("Submission - pausing timer");
    setIsTimerRunning(false);
    
    // Evaluate if the answer is correct (check if the user's answer matches the correct answer)
    const userAnswer = selectedWords.filter(w => w !== null) as string[];
    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(currentQuestion.correctAnswer);
    
    // Save the result
    const newResults = [...results, {
      prompt: currentQuestion.question,
      userAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect
    }];
    setResults(newResults);
    
    // Move to the next question or finish the game
    if (currentQuestionIndex < questions.length - 1) {
      console.log("Moving to next question");
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        // Reset the timer state here
        console.log("Resetting timer for next question");
        setTimeRemaining(30);
        setIsTimerRunning(true);
      }, 500);
    } else {
      // Quiz complete
      console.log("Quiz complete");
      setTimeout(() => {
        onComplete(newResults);
      }, 500);
    }
  };

  // Handle quitting the quiz
  const handleQuit = () => {
    // Complete with current results
    onComplete(results);
  };

  if (loading || !allQuestionsSelected) {
    return (
      <div className="p-6 text-center flex items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg text-gray-700">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-3 sm:p-4 md:p-6 flex flex-col">
      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
        <div className="flex items-center">
          <Timer 
            key={`timer-${currentQuestionIndex}`} 
            seconds={timeRemaining} 
            isRunning={isTimerRunning} 
            onTimerEnd={handleTimerEnd} 
          />
        </div>
        <div className="flex items-center">
          <div className="hidden sm:flex items-center mr-3 bg-blue-50 px-2 py-1 rounded-md">
            <span className="text-sm font-medium text-blue-800">
              Question {currentQuestionIndex + 1}<span className="text-gray-500"> of </span>{questions.length}
            </span>
          </div>
          <button 
            className="px-2 py-1 sm:px-3 sm:py-1 md:px-4 md:py-2 bg-red-500 text-white rounded text-xs sm:text-sm md:text-base hover:bg-red-600 transition-colors"
            onClick={handleQuit}
          >
            Quit
          </button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="flex mb-3 sm:mb-4 md:mb-6">
        {Array.from({ length: questions.length }).map((_, i) => (
          <div 
            key={i} 
            className={`h-1 flex-1 mx-0.5 ${
              i < currentQuestionIndex ? 'bg-blue-500' : 
              i === currentQuestionIndex ? 'bg-yellow-400' : 
              'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      <div className="mb-6 sm:mb-8 text-center flex-grow flex flex-col">
        <h3 className="text-xl sm:text-2xl mb-6 sm:mb-8 text-black font-semibold">Select the missing words in the correct order</h3>
        
        <div className="text-lg sm:text-xl leading-relaxed mb-8 sm:mb-12 min-h-[150px] flex flex-wrap items-center justify-center text-black mx-auto max-w-full px-4 space-y-4 tracking-wide">
          {processPrompt(currentQuestion.question)}
        </div>
        
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5 mt-auto">
          {availableOptions.map((option, index) => (
            <button
              key={index}
              className="px-4 py-2 sm:px-5 sm:py-3 bg-white border border-gray-300 rounded-md hover:bg-gray-100 text-gray-800 option-button text-base sm:text-lg font-medium"
              onClick={() => handleSelectWord(option)}
              disabled={selectedWords.every(word => word !== null)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end mt-auto">
        <button 
          className={`
            px-4 py-2 sm:px-6 sm:py-3 rounded-md text-base sm:text-lg 
            transition-all duration-300
            ${allOptionsSelected
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
            }
          `}
          disabled={!allOptionsSelected}
          onClick={handleSubmit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SentenceConstruction;
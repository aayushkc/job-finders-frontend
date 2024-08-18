"use client"
import getRequestWithToken from "@/app/api/getRequestWithToken";
import PostFormWithToken from "@/app/api/postFormWithToken";
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import CountDown from '@/app/components/countDown';
import QuizCompletionBox from "./_quizCompletionBox";

export default function QuestionSet() {

    const router = useRouter()
    const { id } = useParams()
    const serachParam = useSearchParams()
    const accessToken = Cookies.get("accessToken")
    const { isLoggedIn } = useAuth();

    const [quizData, setQuizData] = useState(null)
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [numberOfQuestion, setNumberOfQuestion] = useState(1)
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [submissionStatus, setSubmissionStatus] = useState({ status: 'idle', message: '' });
    const [radioOptionValue, setRadioOptionValue] = useState(null);
    const [quizTime, setQuizTime] = useState(null)
    const [stopTimer, setStopTimer] = useState(false)
    const [timeTaken, setTimeTaken] = useState('00:00:00')
    const [scoreUpdating, setScoreUpdating] = useState(false)
    const handleRadioValueChange = (event) => {
        setRadioOptionValue(event.target.value);
    };

    const handleAnswerClick = (questionId, answerId, isCorrect) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: { answerId, isCorrect }
        });
    };

    const handleNextClick = () => {  
        setRadioOptionValue(null)
        // if (selectedAnswers[quizData.questions[currentQuestionIndex].id]?.isCorrect) {
        //     console.log("ENtered correct answer");
        //     const newScore = score + 1
        //     setScore(newScore);
        // }
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };


    

    //Function called when time's up
    //Handles automatic form submission
    const handleTimeFinshed = () => {
        // Update the score based on the selected answers
        setSelectedAnswers((prevState) => {
            let totalScore = 0;
            console.log("Previoud selected state",prevState);
            
            for (let key in prevState) {
                if (prevState[key].isCorrect) {
                    totalScore += 1;
                }
            }
    
            setScore(totalScore);
            setScoreUpdating(true)
            return prevState; // Return the same state since we're not changing it here
        });
      
    };
    useEffect(() =>{
        if(scoreUpdating){
            submitQuiz(score)
        }
    },[scoreUpdating])
    const submitQuiz = async (totalScore) => {
        const formData = new FormData();
        formData.append("job", serachParam.get('jobId'));
        formData.append("quiz_score", totalScore);
        console.log(timeTaken);
        
        formData.append('quiz_completion_time', timeTaken);
    
        try {
            const data = await PostFormWithToken(`/job-seeker/create-job-request/`, formData);
            if (data.detail) {
                throw new Error("Cannot Fetch");
            }
            setSubmissionStatus({ status: 'success', message: 'Your application has been sent successfully' });
        } catch (errors) {
            setSubmissionStatus({ status: 'faliure', message: 'An error occurred during the submission.' });
        } finally {
            setStopTimer(true); // Stop the timer after submission
        }
    };

    const setTimeTakenToComplete = (timeString) =>{
        setTimeTaken(timeString)
    }

    const handleSubmit = () => {

        let totalScore = 0;
        for (let key in selectedAnswers) {
            if (selectedAnswers[key].isCorrect) {
                totalScore += 1;
            }
        }
        setScore(totalScore);
        submitQuiz(totalScore)
    };

    const getQuizSet = async () => {
        try {
            const res = await getRequestWithToken(`/quiz/get-quiz-seeker/${id}`, accessToken)
            setNumberOfQuestion(res.no_of_question);
            setQuizTime(res.total_quiz_time)
            setQuizData(res)
        } catch (error) {
            setSubmissionStatus({status:'quiz_faliure', message: "Failed to load quiz"})
        }
    }

    useEffect(() => {
        if (!isLoggedIn) router.push("/signin")
    }, [isLoggedIn, router])

    useEffect(() => {
        getQuizSet()
    }, [id, accessToken])

    const currentQuestion = quizData?.questions[currentQuestionIndex];

    if(!quizData && submissionStatus.status === 'quiz_faliure'){
        return <div>{submissionStatus.message}</div>
    }

    return (
        <section className='bg-[#F3F4F8] h-screen'>
            <section className="flex px-4 sm:justify-center  pt-[8%]">
                {
                    submissionStatus.status === 'success' && <QuizCompletionBox
                        dialogHeading={"Success"}
                        dialogText={submissionStatus.message}
                        success={true}
                        score={score}
                        numberOfQuestion={numberOfQuestion}
                        goToPageName={" to Job Status"}
                        url={"/job-status"}
                    />
                }

                {
                    submissionStatus.status === 'faliure' && <QuizCompletionBox
                        dialogHeading={"An Error occured during Submission"}
                        dialogText={submissionStatus.message}
                        error={true}
                    />
                }
                <div className="bg-white py-6 px-6 sm:px-10 sm:w-1/2 rounded">
                    {quizTime && <CountDown setTimeTakenToComplete={setTimeTakenToComplete} time={quizTime} stopTimer={stopTimer} handleTimeFinshed={handleTimeFinshed} />}
                    <div className='p-4 sm:px-6 border border-[#DADCE0] rounded mt-4'>
                        <h2 className="font-bold sm:text-lg">{currentQuestion?.question}</h2>
                        <ul className="mt-3">
                            <RadioGroup
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={radioOptionValue}
                                onChange={handleRadioValueChange}

                            >
                                {currentQuestion?.answers.map(answer => (
                                    <li key={answer.id}>

                                        <button
                                            onClick={() => handleAnswerClick(currentQuestion.id, answer.id, answer.is_correct)}
                                            className="flex items-center gap-4 mt-2"
                                        >
                            
                                            <FormControlLabel
                                                value={answer.option}
                                                control={
                                                    <Radio sx={{
                                                        '&.Mui-checked': {
                                                            color: '#FFB000',
                                                        }
                                                    }}
                                                    />
                                                }
                                                label={answer.option}
                                            />
                                        </button>
                                    </li>
                                ))}
                            </RadioGroup>
                        </ul>
                    </div>


                    <button
                        onClick={currentQuestionIndex < quizData?.no_of_question - 1 ? handleNextClick : handleSubmit}
                        disabled={!selectedAnswers[currentQuestion?.id]}
                        className="bg-gurkha-yellow w-full py-2 text-white text-center rounded-xl mt-4">
                        {currentQuestionIndex < quizData?.no_of_question - 1 ? "Next" : "Submit"}
                    </button>

                </div>

            </section>
        </section>

    );

}
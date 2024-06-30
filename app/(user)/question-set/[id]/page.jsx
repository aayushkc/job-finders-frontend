"use client"
import * as React from 'react';
import getRequestWithToken from "@/app/api/getRequestWithToken";
import PostFormWithToken from "@/app/api/postFormWithToken";
import DialogBox from "@/app/components/sucessbox";
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Cookies from "js-cookie";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

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
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [success, setSuccess] = useState(false)
    const [falliure, setFaliure] = useState(false)

    const [value, setValue] = useState(null);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const getQuizSet = async () => {
        try {
            const res = await getRequestWithToken(`/quiz/get-quiz-seeker/${id}`, accessToken)
            console.log(res);
            setNumberOfQuestion(res.no_of_question)
            setQuizData(res)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getQuizSet()
    }, [])

    useEffect(() => {
        if (!isLoggedIn) router.push("/signin")
    }, [isLoggedIn])

    if (!quizData) {
        return <div>Error loading quiz data.</div>;
    }

    const handleAnswerClick = (questionId, answerId, isCorrect) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [questionId]: { answerId, isCorrect }
        });
    };

    const handleNextClick = () => {

        if (selectedAnswers[quizData.questions[currentQuestionIndex].id]?.isCorrect) {
            setScore(score + 1);
        }
        if (currentQuestionIndex < quizData.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = async () => {
        console.log(selectedAnswers[quizData.questions[currentQuestionIndex].id]);
        let finalScore = score
        if (selectedAnswers[quizData.questions[currentQuestionIndex].id].isCorrect) {
            finalScore += 1
        }
        setScore(finalScore)
        setIsSubmitted(true);
        const formData = new FormData()

        formData.append("job", serachParam.get('jobId'))
        formData.append("quiz_score", finalScore)
        try {
            const data = await PostFormWithToken(`/job-seeker/create-job-request/`, formData)
            if (data.detail) {
                console.log(data);
                throw new Error("Cannot Fetch")
            }


            setSuccess(true)


        }
        catch (errors) {

            setFaliure(true)
        }
    };

    const currentQuestion = quizData.questions[currentQuestionIndex];

    return (

        <section className="flex px-4 sm:justify-center bg-white pt-[8%]">
            {
                success && <QuizCompletionBox
                    dialogHeading={"Success"}
                    dialogText={"Your application has been sent successfully"}
                    success={true}
                    score = {score}
                    numberOfQuestion={numberOfQuestion}
                    goToPageName={" to Job Status"}
                    url={"/job-status"}
                />
            }

            {
                falliure && <QuizCompletionBox
                    dialogHeading={"An Error occured during Submission"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }
            <div className="bg-white py-6 px-6 sm:px-10 sm:w-1/2  border border-[#23232180]">

                <h2 className="font-bold sm:text-lg">{currentQuestion.question}</h2>
                <ul className="mt-3">
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}

                    >


                        {currentQuestion.answers.map(answer => (
                            <li key={answer.id}>

                                <button
                                    onClick={() => handleAnswerClick(currentQuestion.id, answer.id, answer.is_correct)}
                                    className="flex items-center gap-4 mt-2"
                                >
                                    {/* <input type="radio" name="option" id={answer.option} className="accent-gurkha-yellow p-2"/> */}
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

                {currentQuestionIndex < quizData.no_of_question - 1 ? (
                    <button onClick={handleNextClick}  disabled={!selectedAnswers[currentQuestion.id]} className="bg-gurkha-yellow w-full py-2 text-white text-center rounded-xl mt-4"> Next</button>
                ) :
                    (
                        <button onClick={handleSubmit}  disabled={!selectedAnswers[currentQuestion.id]} className="bg-gurkha-yellow w-full py-2 text-white text-center rounded-xl mt-4"> Submit</button>
                    )
                }


            </div>

        </section>
    );

}




export function QuizCompletionBox({ url, dialogHeading, dialogText, goToPageName, success, error, deleteBox,score,numberOfQuestion }) {
  const [open, setOpen] = React.useState(true);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const handleRoute = () => {
    router.push(url)
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" sx={{textAlign:"center", fontWeight:"bold", fontSize:"24px"}}>
          {dialogHeading}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {success &&
              <div className='rounded-full flex justify-center '>
                <i className="bi bi-check-circle-fill text-4xl mb-3 text-[#23A26D]"></i>
              </div>
            }
            <p className='text-center font-semibold mb-2'>Quiz Score: {score} out of {numberOfQuestion}</p>
            <p className='font-bold mt-3 text-lg'>{dialogText}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {
            success ? <Button autoFocus onClick={handleRoute}>
              Go {goToPageName}
            </Button> : <Button onClick={() => {handleClose(); router.push('/jobs')}} autoFocus>
              Ok
            </Button>
          }

        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
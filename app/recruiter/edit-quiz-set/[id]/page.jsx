"use client";

import GetRequestNoToken from "@/app/api/getRequestNoToken";
import PostWithTokien from "@/app/api/postWithToken";
import PutWithTokien from "@/app/api/putRequest";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import DialogBox from "@/app/components/sucessbox";
import { Button, Dialog, DialogActions, DialogTitle, FormControl, MenuItem, Select, useMediaQuery } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import DeleteRequest from "@/app/api/deleteRequest";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getRequestWithToken from "@/app/api/getRequestWithToken";
import Cookies from "js-cookie";

export default function EditQuestionSetDetail() {
    const { id } = useParams()
    const router = useRouter()
    const accessToken = Cookies.get('accessToken')
    const [formField, setFormField] = useState([{ question: "", answers: [{ option: "", is_correct: false,}, { option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }] }]);
    const [quizname, setQuizName] = useState('');
    const [questoinUploadSuccess, setQuestionUploadSuccess] = useState(false)
    const [questoinUploadError, setQuestionUploadError] = useState(false)
    const [areYouSure, setAreYouSure] = useState(false)
    const [deleteSuccess, setDeleteSuccess] = useState(false)
    const [deleteError, setDeleteError] = useState(false)
    const [open, setOpen] = useState(true);
    const handleAddInput = () => {
        setFormField([...formField, { question: "", answers: [{ option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }] }]);
    };


    const handleModalClose = () => {
        setOpen(false);
    };

    const handleDelete = async () => {
        setDeleteError(false)
        setDeleteSuccess(false)
        setOpen(true)
        try {
            const res = await DeleteRequest(`/quiz/delete-quiz/${id}`)

            if (res.detail) {
                throw new Error("Cannot Fetch")
            }

            setDeleteSuccess(true)


        }
        catch (errors) {


            setDeleteError(true)
        }
    }

    const handleCloseDeleteComp = () => {
        setAreYouSure(false)
        setOpen(true)
    }

    const handleChange = (event, index, optionIndex = null) => {
        const { name, value } = event.target;
        const updatedFormField = [...formField];

        if (optionIndex !== null) {
            updatedFormField[index].answers[optionIndex].option = value;
        } else {
            updatedFormField[index][name] = value;
        }

        setFormField(updatedFormField);
    };

    const handleSelectChange = (event, questionIndex) => {
        const { value } = event.target;
        const updatedFormField = [...formField];
        updatedFormField[questionIndex].answers.forEach((option, index) => {
            option.is_correct = (index === parseInt(value));
        });

        setFormField(updatedFormField);
    };

    const handleDeleteInput = async (index, questionId) => {
        const updatedFormField = [...formField];
        if (questionId) {
            try {
                const res = await DeleteRequest(`/quiz/delete-question/${questionId}`)
                toast.success( 'Question Removed Successfully', {
                    position: "bottom-right",
                    autoClose: 800,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                    theme: "light",
                    });
                updatedFormField.splice(index, 1);
                setFormField(updatedFormField);
                return;
            }
            catch (error) {
                console.log(error);
                return;
            }
        }
        updatedFormField.splice(index, 1);
        setFormField(updatedFormField);
        return;
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setQuestionUploadSuccess(false)
        setQuestionUploadError(false)
        const formData = {
            quiz_name: quizname,
            questions: formField.map(({ question, answers, id }) => ({
                question,
                id: id,
                answers: answers
            }))
        };
        console.log(formData);
        try {
            const data = await PutWithTokien(`/quiz/get-quiz/${id}`, formData);
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }

            setQuestionUploadSuccess(true)
        }
        catch (errors) {
            console.log(errors);
            setQuestionUploadError(true)
        }
    };

    const getQuestionSet = async () => {
        try {
            const data = await getRequestWithToken(`/quiz/get-quiz/${id}`, accessToken)
            console.log(data);
            setQuizName(data.quiz_name)
            setFormField(data.questions)
        }
        catch (errors) {
            console.log(errors);
        }
    }

    useEffect(() => {
        getQuestionSet()
    }, [])
    return (
        <AdminDashBoardLayout>
           
            {
                questoinUploadSuccess && <DialogBox
                    dialogHeading={"Question Set Has Been Edited Sucessfully"}
                    dialogText={"Question Set has been edited SuccessFully"}
                    goToPageName={"Edit Question Set"}
                    url={"/recruiter/edit-quiz-set"}
                    success={true}
                />
            }

            {
                questoinUploadError && <DialogBox
                    dialogHeading={"An Error occured during Submission"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }
            <section className="bg-white p-6">
                <button className="py-2 px-4 text-sm bg-gurkha-yellow text-white rounded-xl" onClick={() => router.back() }> <i className="mr-1 bi bi-arrow-left"></i> Go back</button>
                <h2 className="text-3xl font-semibold mt-4">Edit Question Set</h2>
                <form className="mt-8" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-2 text-lg">
                        <label className="font-semibold">Name</label>
                        <input
                            type="text"
                            placeholder="Quiz Name"
                            required
                            value={quizname}
                            name="quiz_name"
                            onChange={(e) => setQuizName(e.target.value)}
                            className="w-1/2 rounded-lg py-1 px-3 border-2 text-[#79767C] border-[#23232180]"
                        />
                    </div>
                    {formField?.map((data, questionIndex) => (

                        <div key={questionIndex} className="border w-1/2 text-[#79767C] border-[#23232180] mt-10 rounded p-3 flex flex-col">
                            {console.log("QUestionsssss Dataaaa", data.question)}
                            {
                                formField.length > 1 && (
                                    <div className="flex justify-end">
                                        <i className="bi bi-trash text-[#FFC033] cursor-pointer" onClick={() => handleDeleteInput(questionIndex, data.id)}></i>
                                    </div>
                                )
                            }

                            <input
                                type="text"
                                required
                                name="question"
                                onChange={(event) => handleChange(event, questionIndex)}
                                value={data.question}
                                placeholder="Question"
                                className="rounded-lg py-1 px-2 text-[#79767C]"
                            />
                            {data.answers?.map((option, optionIndex) => (
                                <input
                                    key={optionIndex}
                                    type="text"
                                    required
                                    name={`option${optionIndex}`}
                                    onChange={(event) => handleChange(event, questionIndex, optionIndex)}
                                    value={option.option}
                                    placeholder={`Option ${optionIndex + 1}`}
                                    className={`rounded-lg py-1 px-2 text-[#79767C] mt-2 ml-3`}
                                />
                            ))}
                            <div className="mt-3 ml-2">
                                <h5 className="text-sm text-[#FFC033]">Answer</h5>
                                <FormControl sx={{ m: 1, minWidth: 120 }}>
                                    <Select
                                        value={data.answers?.findIndex(option => option.is_correct)}
                                        onChange={(event) => handleSelectChange(event, questionIndex)}
                                        displayEmpty
                                        required
                                    >
                                        <MenuItem value={0}>Option 1</MenuItem>
                                        <MenuItem value={1}>Option 2</MenuItem>
                                        <MenuItem value={2}>Option 3</MenuItem>
                                        <MenuItem value={3}>Option 4</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                        </div>
                    ))}
                    <div>
                        <button
                            className="text-[#0B69FF] mt-3"
                            onClick={handleAddInput}
                            type="button"
                        >
                            + Add Question
                        </button>
                    </div>
                    <div className="mt-20 flex flex-col sm:flex-row gap-8 items-center">
                        <button className="bg-[#FFB000] rounded  py-2 w-1/2 text-white font-semibold">
                            Save Set {` ->`}
                        </button>
                   

                    <button
                        onClick={() => setAreYouSure(true)}
                        type="button"
                        className="block w-1/2 cursor-pointer rounded bg-rose-500  py-2 text-center font-semibold text-white hover:bg-rose-400 focus:outline-none focus:ring focus:ring-rose-500 focus:ring-opacity-80 focus:ring-offset-2 disabled:opacity-70"
                    >

                        Delete Job

                    </button>
                    </div>
                </form>
            </section>
            {areYouSure && <AreYourSureComponent handelDelete={handleDelete} handelNoDelete={handleCloseDeleteComp} handleModalClose={handleModalClose} open={open} />}
            {
                deleteSuccess && <DialogBox
                    dialogHeading={"Quiz Set Has  Deleted Sucessfully"}
                    dialogText={"Quiz Set has been deleted SuccessFully"}
                    goToPageName={"Edit Quiz Set"}
                    url={"/recruiter/edit-quiz-set"}
                    success={true}
                    deleteBox={true}
                />
            }

            {
                deleteError && <DialogBox
                    dialogHeading={"An Error occured during deletion"}
                    dialogText={"Please try again"}
                    error={true}
                />
            }

            <ToastContainer />
        </AdminDashBoardLayout>
    );
}

const AreYourSureComponent = ({ handelDelete, handelNoDelete, open, handleModalClose }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    return (
        <>
            <Dialog
                fullScreen={fullScreen}
                open={open}
                onClose={() => handleModalClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    Are you Sure you Want To Delete?
                </DialogTitle>
                {/* <DialogContent>
                    <DialogContentText>
                        {dialogText}
                    </DialogContentText>
                </DialogContent> */}
                <DialogActions>

                    <Button onClick={() => handelDelete()} autoFocus>
                        Yes
                    </Button>


                    <Button onClick={() => { handelNoDelete() }} autoFocus>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
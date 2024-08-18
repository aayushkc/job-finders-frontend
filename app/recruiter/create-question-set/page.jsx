"use client";

import PostWithTokien from "@/app/api/postWithToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import DialogBox from "@/app/components/sucessbox";
import { FormControl, MenuItem, Select } from "@mui/material";
import { useState } from "react";

export default function CreateQuestionSet() {
    const [formField, setFormField] = useState([{ question: "", options: [{ option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }] }]);
    const [quizname, setQuizName] = useState('');
    const [quizDuration, setQuizDuration] = useState('00:00:00')
    const [questoinUploadSuccess, setQuestionUploadSuccess] = useState(false)
    const [questoinUploadError, setQuestionUploadError] = useState(false)

    const handleAddInput = () => {
        setFormField([...formField, { question: "", options: [{ option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }, { option: "", is_correct: false }] }]);
    };

    const handleChange = (event, index, optionIndex = null) => {
        const { name, value } = event.target;
        const updatedFormField = [...formField];

        if (optionIndex !== null) {
            updatedFormField[index].options[optionIndex].option = value;
        } else {
            updatedFormField[index][name] = value;
        }

        setFormField(updatedFormField);
    };

    const handleSelectChange = (event, questionIndex) => {
        const { value } = event.target;
        const updatedFormField = [...formField];
        updatedFormField[questionIndex].options.forEach((option, index) => {
            option.is_correct = (index === parseInt(value));
        });

        setFormField(updatedFormField);
    };

    const handleDeleteInput = (index) => {
        const updatedFormField = [...formField];
        updatedFormField.splice(index, 1);
        setFormField(updatedFormField);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setQuestionUploadSuccess(false)
        setQuestionUploadError(false)
        const formData = {
            quiz_name: quizname,
            total_quiz_time: quizDuration,
            questions: formField.map(({ question, options }) => ({
                question,
                answers: options
            }))
        };
        try {
            const data = await PostWithTokien("/quiz/create-quiz", formData);
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

    return (
        <AdminDashBoardLayout>
            {
                questoinUploadSuccess && <DialogBox
                    dialogHeading={"Question Set Has Been created Sucessfully"}
                    dialogText={"Question Set has been created SuccessFully"}
                    goToPageName={"View All quizes"}
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
                <h2 className="text-3xl font-semibold">Create Question Set</h2>
                <form className="mt-8" onSubmit={handleFormSubmit}>
                    <div className="flex flex-col gap-2 text-lg">
                        <label className="font-semibold">Name</label>
                        <input
                            type="text"
                            placeholder="Quiz Name"
                            required
                            name="quiz_name"
                            onChange={(e) => setQuizName(e.target.value)}
                            className="w-1/2 rounded-lg py-1 px-3 border-2 text-[#79767C] border-[#23232180]"
                        />
                    </div>

                    <div className="flex flex-col gap-2 text-lg mt-8">
                        <label className="font-semibold">Quiz Duration</label>
                        <em className="text-sm">Enter time in minutes.The maximum time allowed is 45 minutes.</em>
                        <div className="flex gap-2 items-center">
                            <input
                                type="number"
                                min={1}
                                max={45}
                                required
                                placeholder="Enter time in minutes"
                                name="total_quiz_time"
                                onChange={(e) => setQuizDuration(`00:${e.target.value}:00`)}
                                className="w-[200px] rounded-lg py-1 px-3 border-2 text-sm text-[#79767C] border-[#23232180]"
                            />
                            <p className="text-sm">minutes</p>
                        </div>

                    </div>

                    {formField.map((data, questionIndex) => (
                        <div key={questionIndex} className="border w-1/2 text-[#79767C] border-[#23232180] mt-10 rounded p-3 flex flex-col">
                            {
                                formField.length > 1 && (
                                    <div className="flex justify-end">
                                        <i className="bi bi-trash text-[#FFC033]" onClick={() => handleDeleteInput(questionIndex)}></i>
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
                            {data.options.map((option, optionIndex) => (
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
                                        value={data.options.findIndex(option => option.is_correct)}
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
                    <div>
                        <button className="bg-[#FFB000] rounded py-4 w-1/2 text-white font-semibold mt-4">
                            Save Set {` ->`}
                        </button>
                    </div>
                </form>
            </section>
        </AdminDashBoardLayout>
    );
}

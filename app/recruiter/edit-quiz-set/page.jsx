"use client"
import getRequestWithToken from "@/app/api/getRequestWithToken";
import AdminDashBoardLayout from "@/app/components/DashBoardLayout";
import PaginationComponent from "@/app/components/paginationcomponent";
import Cookies from "js-cookie";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function EditQuizSet() {

    const accessToken = Cookies.get('accessToken')
    const [quiz, setQuiz] = useState([])
    const [pageNum, setPageNum] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const getAllquiz = async () => {
        try {
            const data = await getRequestWithToken(`/quiz/get-all-quiz?page=${pageNum}`, accessToken)
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            
            // The total count of data needs to be dividd by the number of data sent per page by backend
            const pages = Math.ceil(data.count / 3)
            setTotalPage(pages)
            setQuiz(data.results)

        }
        catch (errors) {
           
           setQuiz([])
        }
    }

    const handlePageChange = (e, page) => {
        
        setPageNum(page)
    }
    useEffect(() => {
        getAllquiz()

    }, [pageNum])

    return (
        <AdminDashBoardLayout>
           
            <section>
                {
                    quiz?.length > 0 ? quiz.map((data,index) =>(
                        <div className="bg-white px-8 py-4 rounded-xl border-[1px] border-[#404040] mt-4" key={data.id}>
                                 <h2 className="text-xl font-bold">{data.quiz_name}</h2>

                                 <button className="bg-[#FEF4DF] rounded-xl text-sm py-2 px-4 mt-4">
                                    No. Of Questions: {data.no_of_question}
                                 </button>

                                 <div className="flex justify-end text-[#0B69FF]">
                                    <Link href={`/recruiter/edit-quiz-set/${data.id}`}><button className="">Edit Details <i className="bi bi-arrow-up-right"></i></button></Link>
                                 </div>
                        </div>
                    ))
                    :
                    (
                        <div className="bg-white w-full h-[400px] grid">
                            <h1 className="place-self-center font-bold text-4xl">No quiz to Display!</h1>
                        </div>
                    )
                }
               
                
                
            </section>
            <div className="flex justify-end mt-6">
                <PaginationComponent onChange={handlePageChange} totalPage={totalPage} />
            </div>
           
        </AdminDashBoardLayout>
    )

}
import GetRequestNoToken from "@/app/api/getRequestNoToken"
import JobPanelData from "@/app/components/JobPanelData"
import { cookies } from "next/headers"
import Link from "next/link"
import { Suspense } from "react"

async function getJobFromIndex(currentJobIndex) {
    const data = await GetRequestNoToken(`/job-seeker/get-job/${currentJobIndex}`)
    return data
}
export default async function JobServerDetail({params}){
    const {id} = params
    const accessToken = cookies().get('accessToken')?.value || undefined
    const isSeeker = cookies().get('isSeeker')?.value || undefined
    const jobsDetail = await getJobFromIndex(id)
    return(
        <>
        <section className="sm:hidden">
        {
                            jobsDetail?.id &&

                                <Suspense>
                                    <JobPanelData jobPanelData={jobsDetail} accessToken={accessToken} isUserLoged={isSeeker} />
                                </Suspense>
        }

        </section>

        <section className="hidden sm:grid w-full h-[90vh]">
            <div className="place-self-center">
                <h1 className="font-bold text-3xl mb-6">Not Allowed to View this Page</h1>
            <Link href="/jobs-server" className="flex justify-center"><button className="bg-gurkha-yellow py-3 px-6 rounded-xl text-white text-lg">Go back</button></Link>
            </div>
               
        </section>
        </>
    )
}
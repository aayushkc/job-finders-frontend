
import GetRequestNoToken from "@/app/api/getRequestNoToken"
import JobPanelData from "@/app/components/JobPanelData"
import { cookies } from "next/headers"
import Link from "next/link"

async function getJobFromId(id) {

    const data = await GetRequestNoToken(`/job-seeker/get-job/${id}`)
    return data
}

export async function generateMetadata({ params }) {
    const job = await getJobFromId(params.slug[0]).catch((err) => {
        return {
            title: 'Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha',
            required_skills: [],
            job_category: []
        }
    })
    
    if (job.detail) {
        return {
            title: 'Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha',
            description: 'Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha',
            keywords: []
        }
    }

    return {
        title: `${job.title} | Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha`,
        description: `${job.company} is hiring for the role ${job.title} and the required skillset are ${job?.required_skills.map(data => `${data.title}`)}. Apply to thiS job though remote job platform HireGurkha.com. (Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha)`,
        keywords: [`Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha`, [`Remote Job Nepal`], [`Remote Jobs`], [job?.required_skills.map(data => `${data.title}`)], [job?.job_category.map(data => data.title)]],
        robots: {
            index: false,
            follow: true,
            nocache: true,
            googleBot: {
                index: true,
                follow: false,
                noimageindex: true,
            }
        },
        alternates: {
            canonical: 'https://hiregurkha.com/jobs/',

        }
    }
}
export default async function JobFromId({ searchParams, params }) {

    const isSeeker = cookies().get('isSeeker')?.value || undefined
    const accessToken = cookies().get('accessToken')?.value || undefined
    const pageNum = searchParams?.pageNum || 1

    const jobData = await getJobFromId(params.slug[0]).catch((err) => null)

    if (jobData === null) {
        return (
            <section className="h-[80vh] grid">
                <div className="place-self-center text-2xl sm:text-5xl capitalize">
                    Could not fetch data.
                </div>
            </section>
        )
    }

    if (jobData.detail) {
        return (
            <section className="h-[80vh] grid">
                <div className="place-self-center text-2xl sm:text-5xl capitalize">
                    The requested Job does not exist.
                </div>
            </section>
        )
    }

    return (
        <>
            <section className="pt-10 bg-white">
            <Link href="/jobs" className="text-sm">
                <button className='text-white px-5 py-2 bg-gurkha-yellow rounded-xl flex gap-2 items-center ml-4 sm:ml-16'>
                    <i className='bi bi-arrow-left'></i>
                    <p>Go Back</p>
                </button>
            </Link>

                {
                    jobData && <JobPanelData jobPanelData={jobData} pageNum={pageNum} isUserLoged={isSeeker} accessToken={accessToken} />
                }

            </section>

        </>

    )
}
"use client"
import Link from "next/link";

export default function ApplicantDisplayCard({ applicant }) {
    return applicant.map(data => {
        return (

            <div className="bg-white px-8 py-4 rounded-xl border-[1px] border-[#D9D9D9] mt-4 flex gap-10 items-center">


                <div className='w-[125px] h-[125px] mb-1 border-[0.5px] rounded-full mt-10 p-4 border-[#514646] grid'>
                    <img src={data.job_seeker.seeker_details.profilePic} alt="profile" className='w-[95%] h-[95%] object-contain place-self-center' />
                </div>


                <div>

                    <div className="flex gap-2 items-center mt-3">
                        <p className="text-[#4F5052] text-sm">Full Name:</p>
                        {`${data.job_seeker.seeker_details.first_name} ${data.job_seeker.seeker_details.middle_name} ${data.job_seeker.seeker_details.last_name}`}

                    </div>

                    <div className="flex gap-2 items-center mt-3">
                        <p className="text-[#4F5052] text-sm">Skills:</p>
                        {data.job_seeker.seeker_details.skills.map((data, index) => {
                            console.log(data)
                            return <p className="bg-[#F3F4F8] text-black text-xs font-light p-2 rounded-xl" key={index}>{data.title}</p>
                        })}

                    </div>
                    
                    <button className="bg-gurkha-yellow py-2 px-3 text-sm rounded-xl mt-4 text-white"><a href={data.job_seeker.seeker_details.resume}>Download Resume</a></button>

                </div>



            </div>
        )

    })

}
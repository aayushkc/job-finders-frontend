"use client"
import Link from "next/link";

export default function JobDisplayCard({jobs}){
  return jobs.map(data => {
    return(
      
        <div className="bg-white px-8 py-4 rounded-xl border-[1px] border-[#D9D9D9] mt-4">
            
        <h2 className="text-xl font-bold">{data.title}</h2>
        <div className="flex gap-2 items-center mt-3">
            <p className="text-[#4F5052] text-sm">Skills:</p>
            {data.required_skills.map((data, index) => {
                console.log(data) 
                return <p className="bg-[#F3F4F8] text-black text-xs font-light p-2 rounded-xl" key={index}>{data.title}</p>})}
           
        </div>
        <h2 className="text-[#4F5052] text-lg mt-3">{data.company}</h2>
        <div className="flex flex-wrap gap-2 mt-3">
            <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl">
                <p className="">Location:</p>
                <p className="text-[#4F5052] font-light">{data.job_location}</p>
            </div>

            <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl">
                <p className="">Experience Required:</p>
                <p className="text-[#4F5052] font-light capitalize">{data.required_years_of_experience}</p>
            </div>

            
            <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl">
                <p className="">Job Type:</p>
                <p className="text-[#4F5052] font-light">{data.work_location_type}</p>
            </div>


            
            <div className="flex gap-2 items-center text-sm bg-[#FEF4DF] px-4 py-2 rounded-2xl">
                <p className="">Domain:</p>
                <p className="text-[#4F5052] font-light">{data.industry}</p>
            </div>
        </div>
        <div className="flex gap-2 items-center mt-4">
            <i className="bi bi-coin text-[#FFB000] text-xl"></i>
            <p>{data.salary}</p>
        </div>
        
        <Link href={`/recruiter/view-all-jobs/${data.id}`}>
        <div className="flex justify-end items-center text-[#0B69FF] gap-2">
          
            <p>Edit Details</p>
                <i className="bi bi-arrow-up-right text-xl"></i>
            
               
        </div>
        </Link>
    </div>
    )

  })
   
}
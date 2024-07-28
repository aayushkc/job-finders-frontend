import Image from "next/image";
import Link from "next/link";
import GetRequestNoToken from "../api/getRequestNoToken";

async function getSkills(){
  const data = await GetRequestNoToken(`/get-skills/?industry=null`)
  return data
}

async function getJobCategory(){
  const data =  await GetRequestNoToken('/job-preference/')
  return data
}

export default async function Footer(){

    const skills = await getSkills().catch((err) =>{return []})
    const jobCategory = await getJobCategory().catch((err) =>{return []})

    return (
        <footer className="bg-[#F5F9FC] py-16 px-4 sm:px-32">
            <div className="flex flex-col sm:flex-row">
                <div className="basis-3/5">
                    <Image src="/images/Footerlogo.png" alt="logo" className="max-w-full max-h-full" width="102" height="42"/>
                    <p className="text-sm font-light mt-8">© 2023 Nexsewa Pvt. Ltd. All Rights Reserved.</p>

                    <div className="my-8 flex gap-8 items-center text-3xl sm:text-4xl">
                        <i className="bi bi-facebook"></i>
                        <i className="bi bi-youtube"></i>
                        <i className="bi bi-instagram"></i>
                        <i className="bi bi-linkedin"></i>
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row gap-10 sm:gap-24">
                    <div>
                    <h3 className="font-bold">More About Us</h3>
                    <ul>
                        <li className="mt-6"><Link href={"/about-us"}>About Us</Link></li>
                        <li className="mt-6">Contact Us</li>
                        <li className="mt-6"><Link href={"/blogs"}>Blogs</Link></li>
                        {/* <li className="mt-6">Career</li> */}
                    </ul>
                    </div>
                   

                    <div>

                        <h3 className="font-bold">Related Information</h3>
                        <ul>
                            <li className="mt-6"><Link href={"/blogs"}>Blogs</Link></li>
                            <li className="mt-6"><Link href={"/privacy-policy"}>Privacy</Link></li>
                            {/* <li className="mt-6">Applicant and Candidate</li> */}
                            <li className="mt-6"><Link href={"/terms-and-conditions"}>Terms</Link></li>
                        </ul>
                    </div>
                </div>



            </div>
            
            <div className="w-full h-[1px]  bg-[#6f7172] mt-16">

            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-20">

                {/* Domain */}
                <div>
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block sm:text-left text-transparent bg-clip-text">Domains</h2>
                <ul className="grid grid-cols-2 gap-x-8 text-sm">
                 {
                    jobCategory?.map(data =>(
                
                        <Link href={`/jobs?industry=${data.id}`} key={data.id}>
                            
                        <li className="mt-5 flex gap-3 items-center"> <Image src={data.icon} alt="icon" width={20} height={20}/>  Jobs In {data.title}</li>
                        </Link> 
                    ))
                 }
                </ul>
                </div>

        

                {/* Skills */}
                <div>
                <h2 className="text-3xl font-semibold bg-gradient-to-r from-[#FD810E] to-[#DA4C98] inline-block sm:text-left text-transparent bg-clip-text">Skills</h2>
                <ul className="grid grid-cols-2 gap-x-10 text-sm">
                    {
                        skills?.map((data,index) =>(
                            <Link href={`/jobs?skills=${data.id}`} key={index}>
                            <li className="mt-5 flex gap-3 items-center"> <Image src={data.icon} alt="icon" width={20} height={20}/>  Jobs In {data.title}</li>
                            </Link> 
                        ))
                    }
                </ul>
               
                </div>
            </div>


        </footer>
    )
}

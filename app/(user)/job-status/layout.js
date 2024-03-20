import JobStatusNav from "@/app/components/jobstatusnav";

export default function Layout({children}){
   return(
       <section className="max-w-[1440px] pt-6 pb-10">
             <div className="pb-6  mx-20 grid grid-cols-[1fr_400px] gap-10">
                        <div>
                            <JobStatusNav />
                            <div >
                             {children}
                            </div>
                               
                        </div>

                        <div className="font-semibold">
                            <div className="p-6 rounded-xl bg-white max-h-max">
                            <h2 className="text-xl">How it Works?</h2>
                                <p>
                                The flow of the work status passes through several phases. We'll let you know as soon as each step is finished.
                                </p>

                            </div>
                               
                        </div>
             </div>
       </section>
   )
}
"use client"
import Image from "next/image";


const Footer = () => {
    return (
        <footer className="bg-[#F5F9FC] py-16 px-4 sm:px-32 mt-10">
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
                        <li className="mt-6">About Us</li>
                        <li className="mt-6">Contact Us</li>
                        <li className="mt-6">Press</li>
                        <li className="mt-6">Career</li>
                    </ul>
                    </div>
                   

                    <div>

                        <h3 className="font-bold">Related Information</h3>
                        <ul>
                            <li className="mt-6">Blog</li>
                            <li className="mt-6">Privacy</li>
                            <li className="mt-6">Applicant and Candidate</li>
                            <li className="mt-6">Terms</li>
                        </ul>
                    </div>
                </div>



            </div>

        </footer>
    )
}

export default Footer;
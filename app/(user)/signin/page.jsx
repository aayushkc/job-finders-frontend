"use client"
import LoginForm from "../../components/loginform";
import google from "../../../public/images/google.png";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/utils/checkIsLoggedIn";
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function SignIn() {
  const { isLoggedIn } = useAuth();
  const router = useRouter()
  console.log(isLoggedIn);
  useEffect(() =>{
    if(isLoggedIn) router.back()
  },[isLoggedIn])

  return (
    <main className="signin grid">
      <section className="sm:place-self-center grid bg-white sm:rounded-xl  text-center sm:w-[35%] px-8 sm:px-2 sm:py-8 py-12 sm:my-10">
        <h1 className="text-4xl font-bold">Sign In</h1>

        <LoginForm />

        {/* <div className="border-[1px] border-gurkha-yellow place-self-center my-5 w-1/2"></div>

        <div className="">
          <p className="text-xs font-light text-[#A0AEC0]">
            or Sign in as User using Google{" "}
          </p>
          <div className="flex justify-center my-4">
            <Image src={google} alt="google" />
          </div>
        </div> */}

        {/* <div className="border-[1px] border-gurkha-yellow place-self-center mb-4 w-1/2"></div> */}

        <div className="mt-4">
          <p className="font-bold text-[#8391A2]">Don't have an account? </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
            <Link href="/register-as-user">
              <button className="bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-8">
                Register as User
              </button>
            </Link>
            <Link href="/register-as-recruiter">
              <button className="bg-gurkha-yellow font-bold text-white rounded-xl py-3 px-8">
                Register as Recruiter
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

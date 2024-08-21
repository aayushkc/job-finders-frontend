import { cookies } from "next/headers";
import AnonUserHomePage from "../components/anonymoususerhomepage";
import Footer from "../components/footer";
import UserHomePage from "../components/userHomePage";

export default function Home() {
  const accessToken = cookies().get('accessToken')?.value || undefined
  const isSeeker = cookies().get('isSeeker')?.value === 'true' || undefined

  if (accessToken && isSeeker){
   
    return <UserHomePage />
  }else{
    return(
    <>
    <AnonUserHomePage />
    <Footer />
    </> 
    )
  }
 
}

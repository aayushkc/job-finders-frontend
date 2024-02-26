
import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";

import AdminNav from "../components/adminnav";
const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Hire Gurkha Recruiter",
  description: "Hire gurkha",
};

export default function RecruiterLayout({children}){
  return (
    <html lang="en">
      <body className={sans.className}>
        <AdminNav ></AdminNav>
        <main className="">
          
        {children}
        </main>
      </body>
    </html>
  );
}

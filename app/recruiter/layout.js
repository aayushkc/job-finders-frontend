
import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";
import 'froala-editor/css/froala_style.min.css';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import AdminNav from "../components/adminnav";
const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Hire Gurkha Recruiter",
  description: "Hire gurkha",
};

export default function RecruiterLayout({children}){
  return (
    <html lang="en">
      <body className={sans.className + "relative"}>
        <AdminNav isRecruiter={true}></AdminNav>
        <main className="mt-[80px]">
          
        {children}
        </main>
      </body>
    </html>
  );
}


import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";
import Navbar from "../components/navbar"
import { AuthProvider } from "../utils/checkIsLoggedIn";
import { Suspense } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'
import 'react-toastify/ReactToastify.min.css';
import 'react-phone-number-input/style.css'
const sans = Open_Sans({ subsets: ["latin"], display:'swap' });

export const metadata = {
  title: "Remote jobs in Nepal(Hire or Get Hired)-Hire Gurkha",
  description: "Discover unparalleled remote work opportunities in Nepal with HireGurkha. Connect with top South Asian talent and global employers through our innovative AI-driven hiring platform. Experience seamless recruitment and embark on a journey to professional success today.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sans.className  + " relative"}>
       
        <AuthProvider>
          <Navbar />
          <main className="mt-[80px]">
            <Suspense>
            {children}
            </Suspense>
           
          </main>

        </AuthProvider>

      </body>
      <GoogleAnalytics gaId="G-9JG53MHYCP" />
    </html>
  );
}

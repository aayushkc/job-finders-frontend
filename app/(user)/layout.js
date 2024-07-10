
import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";
import Navbar from "../components/navbar"
import { AuthProvider } from "../utils/checkIsLoggedIn";
import { Suspense } from "react";
import { GoogleAnalytics } from '@next/third-parties/google'

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Hire Gurkha",
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

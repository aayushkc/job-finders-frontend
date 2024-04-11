
import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";
import Navbar from "../components/navbar"
import { AuthProvider } from "../utils/checkIsLoggedIn";
import { Suspense } from "react";

const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Hire Gurkha",
  description: "Hire gurkha",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={sans.className  + "relative"}>
        <AuthProvider>
          <Navbar />
          <main className="mt-[80px]">
            <Suspense>
            {children}
            </Suspense>
           
          </main>

        </AuthProvider>

      </body>
    </html>
  );
}

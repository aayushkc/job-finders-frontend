
import { Open_Sans } from "next/font/google";
import "bootstrap-icons/font/bootstrap-icons.css"
import "../globals.css";
import 'froala-editor/css/froala_style.min.css';

import 'froala-editor/css/froala_editor.pkgd.min.css';
import AdminNav from "../components/adminnav";
import { AuthProvider } from "../utils/checkIsLoggedIn";
const sans = Open_Sans({ subsets: ["latin"] });

export const metadata = {
  title: "Hire Gurkha Superadmin",
  description: "Hire gurkha",
};

export default function SuperAdminLayout({children}){
  return (
    <html lang="en">
      <body className={sans.className}>
      <AuthProvider>
        <AdminNav isSuperAdmin={true}></AdminNav>
        <main className="">
          
        {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  );
}

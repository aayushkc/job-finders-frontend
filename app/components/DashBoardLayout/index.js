"use client"
import ProtectedAdminPage from "@/app/utils/auth";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { FaRegCircleUser } from "react-icons/fa6";
import {
  HiMiniSquaresPlus,
  HiOutlineSquaresPlus,
  HiPencilSquare,
} from "react-icons/hi2";
import { IoTrendingUpSharp } from "react-icons/io5";

export default function AdminDashBoardLayout({ children }) {
  const currentRoute = usePathname();

  const sideMenu = [
    {
      title: "profile",
      path: "/recruiter",
      icon: <FaRegCircleUser className=" text-[#71839B] text-2xl" />,
    },
    // {
    //   title: "Add New Opening",
    //   path: "/recruiter/add-job",
    //   icon: <HiOutlineSquaresPlus className=" text-[#71839B] text-2xl" />,
    // },
    {
      title: "Applicants",
      path: "/recruiter/applicants",
      icon: <IoTrendingUpSharp className=" text-[#71839B] text-2xl" />,
    },
    {
      title: "Pending Jobs",
      path: "/recruiter/view-all-pending-jobs",
      icon: <HiPencilSquare className=" text-[#71839B] text-2xl" />,
    },

    {
      title: "Listed Jobs",
      path: "/recruiter/view-all-jobs",
      icon: <HiPencilSquare className=" text-[#71839B] text-2xl" />,
    }

  ];
  return (
    <ProtectedAdminPage>
      <div className="flex  min-h-screen">
        <div className=" basis-[20%]  pt-10 border-r-2 ml-8 px-4 mt-6  border-[#CCC5FA]  bg-white ">
          <div>
            <ul className=" flex flex-col gap-4 text-base text-[#324054] font-semibold capitalize">
              {sideMenu.map((item) => (
                <Link key={item.path} href={`${item.path}`}>
                  <li
                    className={` ${currentRoute === `${item.path}` && "bg-[#FCE4B0]"
                      } flex items-center gap-2  w-full p-3`}
                  >
                    {item.icon} {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
        <div className=" basis-[80%] py-10 px-10 ">{children}</div>
      </div>
    </ProtectedAdminPage>

  );
}

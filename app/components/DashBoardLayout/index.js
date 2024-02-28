"use client"
import ProtectedPage from "@/app/utils/auth";
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
    {
      title: "Add New Opening",
      path: "/recruiter/add-job",
      icon: <HiOutlineSquaresPlus className=" text-[#71839B] text-2xl" />,
    },
    {
      title: "Edit Opening Details",
      path: "/recruiter/edit",
      icon: <HiPencilSquare className=" text-[#71839B] text-2xl" />,
    },
    {
      title: "Applicants",
      path: "/recruiter/applicant",
      icon: <IoTrendingUpSharp className=" text-[#71839B] text-2xl" />,
    },

    {
      title: "View All Openings",
      path: "/recruiter/view-all-jobs",
      icon: <HiPencilSquare className=" text-[#71839B] text-2xl" />,
    }

  ];
  return (
    <ProtectedPage>
      <div className=" flex  min-h-screen">
        <div className=" basis-[20%]  pt-10 border-r-2 px-14  border-[#CCC5FA]   ">
          <div>
            <ul className=" flex flex-col gap-4 text-base text-[#324054] font-semibold capitalize">
              {sideMenu.map((item) => (
                <Link key={item.path} href={`${item.path}`}>
                  <li
                    className={` ${currentRoute === `${item.path}` && "bg-[#FCE4B0]"
                      } flex items-center gap-2    text-human-black w-full py-3 px-2 `}
                  >
                    {item.icon} {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className=" flex items-center justify-between mt-10 ">
            <div className=" text-[24px] font-[700] text-human-black">
              Filters
            </div>
            <div className=" text-[14px]  font-semibold text-[#537FE7]">
              Reset All
            </div>
          </div>
          <div>
            <h6 className=" font-[700] my-4 text-human-black text-[20px]">
              Criteria
            </h6>
            <ul className=" text-human-black  text-base flex flex-col gap-5  ">
              <li className="  flex items-center gap-2">
                <input className=" accent-[#1B644D]" type="checkbox" />{" "}
                Shortlisted
              </li>
              <li className="  flex items-center gap-2">
                <input className=" accent-[#1B644D]" type="checkbox" />{" "}
                Shortlisted
              </li>
              <li className="  flex items-center gap-2">
                <input className=" accent-[#1B644D]" type="checkbox" /> Rejected
              </li>

              <li className="  flex items-center gap-2">
                <input className=" accent-[#1B644D]" type="checkbox" /> None
              </li>
            </ul>
          </div>
        </div>
        <div className=" basis-[80%] py-10 px-32 ">{children}</div>
      </div>
    </ProtectedPage>

  );
}

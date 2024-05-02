"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function JobStatusNav(){
    const currentRoute = usePathname();

    const sideMenu = [
      {
        title: "Applied",
        path: "/job-status",
        icon: <i className="bi bi-hand-thumbs-up"></i>
      },
      {
        title: "Shortlisted",
        path: "/job-status/short-listed",
        icon: <i className="bi bi-person-check-fill"></i>
      },
      {
        title: "Closed",
        path: "/job-status/closed",
        icon: <i className="bi bi-x-circle"></i>
      },
     
  
    ];

    return(
        
        <div className="mb-4 py-3 px-4 bg-white w-full rounded-xl ">
          <nav>
            <ul className=" flex flex-col sm:flex-row justify-between text-[#324054] font-semibold capitalize">
              {sideMenu.map((item) => (
                <Link key={item.path} href={`${item.path}`}>
                  <li
                    className={` ${currentRoute === `${item.path}` && "text-[#FFB000] border-b-2 border-b-[#0B69FF]"
                      } flex items-center gap-2  w-full p-3`}
                  >
                    {item.icon} {item.title}
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
        </div>
     
    )
}
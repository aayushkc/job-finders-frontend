import Image from "next/image";
import AdminDashBoardLayout from "../components/DashBoardLayout";
import ImageSkleton from "../../public/profile.png";
import { HiOutlinePencil } from "react-icons/hi";
import ProtectedPage from "../utils/auth";

export default function Home() {
  return (
   <ProtectedPage>
    <AdminDashBoardLayout>
      <div className=" flex flex-col gap-16 ">
        <h3 className=" text-[32px] font-semibold">Profile</h3>
        <div className=" ">
          <span className=" bg-[#E6FAF8] rounded-xl font-semibold text-base text-[#324054] px-4 py-3  ">
            Recruiter
          </span>
        </div>
        <div className="w-[15rem] h-[15rem]  rounded-full bg-gray-400">
          <Image src={ImageSkleton} className=" object-cover w-full h-full" />
        </div>
        <div className=" flex flex-col gap-14">
          <div className=" flex  gap-20  ">
            <div className=" flex flex-col gap-8">
              <div className=" text-human-black font-semibold    text-[32px]">
                Full Name
              </div>
              <div className=" text-human-black    text-base  font-normal">
                Official Email:
                <div>Field</div>
              </div>
              <div className=" text-human-black    text-base  font-normal">
                Official Website:
                <div>Field</div>
              </div>
              <div className=" flex items-center gap-2  text-human-light-blue text-base font-normal w-full">
                <HiOutlinePencil className=" text-2xl" />
                Edit Password
              </div>
            </div>
            <div className=" flex flex-col gap-8">
              <div className=" flex gap-10 items-center">
                <div className=" flex items-center gap-2  text-human-light-blue text-base font-normal w-full">
                  <HiOutlinePencil className=" text-2xl" />
                  Edit Name
                </div>
                <div className=" flex items-center w-full">
                  {/* <InputField
                    className={"py-2 w-[600px] border-[1px] border-[#000000]"}
                  /> */}
                </div>
                <div className=" flex items-center">
                  {/* <Button
                    className={
                      "py-2 px-10 w-[200px] text-black font-normal text-base"
                    }
                  >
                    Save changes
                  </Button> */}
                </div>
              </div>
              <div className=" flex gap-10 items-center">
                <div className=" flex items-center gap-2  text-human-light-blue text-base font-normal w-full">
                  <HiOutlinePencil className=" text-2xl" />
                  Edit Email{" "}
                </div>
                <div className=" flex items-center w-full">
                  {/* <InputField
                    className={"py-2 w-[600px] border-[1px] border-[#000000]"}
                  /> */}
                </div>
                <div className=" flex items-center">
                  {/* <Button
                    className={
                      "py-2 px-10 w-[200px] text-black font-normal text-base"
                    }
                  >
                    Save changes
                  </Button> */}
                </div>
              </div>
              <div className=" flex gap-10 items-center">
                <div className=" flex items-center gap-2  text-human-light-blue text-base font-normal w-full">
                  <HiOutlinePencil className=" text-2xl" />
                  Edit Website
                </div>
                <div className=" flex items-center w-full">
                  {/* <InputField
                    className={"py-2 w-[600px] border-[1px] border-[#000000]"}
                  /> */}
                </div>
                <div className=" flex items-center">
                  {/* <Button
                    className={
                      "py-2 px-10 w-[200px] text-black font-normal text-base"
                    }
                  >
                    Save changes
                  </Button> */}
                </div>
              </div>
              <div className="flex gap-7 ">
                <div className="  flex flex-col gap-10   text-human-light-blue text-base font-normal ">
                  <div>Current Password:</div>
                  <div>New Password::</div>
                </div>
                <div className=" flex  flex-col  gap-5">
                  <div>
                    {" "}
                    {/* <InputField
                      className={"py-2 w-[600px] border-[1px] border-[#000000]"}
                    /> */}
                  </div>
                  <div className=" flex gap-10">
                    {" "}
                    {/* <InputField
                      className={"py-2 w-[600px] border-[1px] border-[#000000]"}
                    /> */}
                    <div className=" flex items-center">
                      {/* <Button
                        className={
                          "py-2 px-10 w-[200px] text-black font-normal text-base"
                        }
                      >
                        Save changes
                      </Button> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashBoardLayout>
   </ProtectedPage> 
    
  );
}


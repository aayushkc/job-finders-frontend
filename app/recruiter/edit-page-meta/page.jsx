import Link from "next/link"
import AdminDashBoardLayout from "@/app/components/DashBoardLayout"
export default function EditPageMetaData() {
    const pages = [ 
        { 'pageName': "About" },
        { 'pageName': "Contact" },

    ]
    return (
        <AdminDashBoardLayout>
            {
                pages.map((data, index) => (
                    <section className="bg-white w-full p-6 rounded-xl flex justify-between items-center mt-4" key={index}>
                        <h2 className="text-3xl font-lightbold">{data.pageName} Page</h2>
                        <Link href={`/recruiter/edit-page-meta/${data.pageName}`}>
                            <button className="bg-[#D91C24] rounded-3xl py-2 px-8 text-white font-semibold">Edit meta data</button>
                        </Link>

                    </section>
                ))
            }

        </AdminDashBoardLayout>
    )
}
import { Lexend_Deca } from "next/font/google";
import ShareButton from "@/app/components/Sharebutton";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
const lexend = Lexend_Deca({ subsets: ["latin"] });

async function GetBlogDetails(id){
    const data = await  fetch(`${APIENDPOINT}/api/v2/pages/${id}/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
          },
       cache:'no-store'
    })
    const res = data.json() 
    return res 
}
export async function generateMetadata({ params }) {

    // fetch data
    const product = await GetBlogDetails(params.id)
  
    return {
      title: product.title,
      openGraph: {
        images: [ {
            url: product?.thumbnail.full_url,
            secureUrl: product?.thumbnail.full_url,
            alt: `Preview image for ${product.title}`,
        }],
      },
    }
  }

export default async function BlogPage({params}) {

    const data = await GetBlogDetails(params.id).catch(() => {})
         
    return (
        <>
            {
                data.id &&  <section className={lexend.className + " bg-white sm:px-40 py-16 px-8"} key={data?.id}>

                <h2 className="text-2xl sm:text-4xl text-[#213343] sm:leading-[60px]">{data?.title}</h2>
                <div className="flex gap-2 items-center mt-3">
                    <p>Share</p>
                    <ShareButton  shareableUrl={`https://hiregurkha.com/blogs/${data.id}/`}/> 
                </div>
              
                
                <hr className="mt-6"></hr>
                <div className="flex flex-col sm:flex-row justify-between items-center my-4 px-4">
                    <p className="underline text-[#0068B1]">By: HireGurkha</p>
                    <p className="text-[#2E475D] mt-3 sm:mt-0">Published: {data?.meta.first_published_at.slice(0,10)}</p>
                </div>
                <hr className="mt-6"></hr>
                <div className="py-10 sm:px-12">
                    <div className="flex justify-center">
                        <img src={data ? `${data?.thumbnail.full_url}` : ""} width={626} height={626} alt={data ? data.thumbnail.alt : "thumbnail"}/>
                    </div>

                    <div className="mt-5 sm:mx-16 blogs-content">
                        {
                            data?.body.length > 0 && data.body?.map((data,index) =>(
                                <div key={index}>
                               { data.type === 'paragraph' && <div  className="text-lg text-[#213343] font-light my-4 sm:leading-[32px]" dangerouslySetInnerHTML={{ __html: data.value }}></div>}
                               { data.type === 'heading' && <h2  className="text-2xl text-[#213343] my-4" dangerouslySetInnerHTML={{ __html: data.value }}></h2>}
                               { data.type === 'image' && <img src={`${data.value.large.src}`} alt={data.value.title} className="object-cover my-8"/>}
                                </div>
                            ))
                        }
                      
                    </div>
                </div>
            </section>
            }
           

            

        </>
    )
}
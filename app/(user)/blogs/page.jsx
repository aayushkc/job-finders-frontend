'use client'
import Image from "next/image"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Footer from "@/app/components/footer";
import GetRequestNoToken from "@/app/api/getRequestNoToken";
import { useEffect, useState } from "react";
import { APIENDPOINT } from "@/app/api/APIENDPOINT";
import Link from "next/link";

export default function Blogs() {
    const arr = [1, 2, 3, 4, 5]
    const [topblog, setTopBlog] = useState(null)
    const [otherBlogs, setOtherBlogs] = useState(null)
    const getBlogPosts = async () => {
        try {
            const data = await GetRequestNoToken('/api/v2/pages/?type=blog.BlogPage&fields=intro,body,thumbnail')
            if (data.detail) {
                throw new Error("Cannot Fetch")
            }
            console.log("Dataaaa", data);
            setTopBlog(data.items[0])
            setOtherBlogs(data.items.slice(1))
        }
        catch (errors) {
            console.log(errors);
        }
    }

    useEffect(() => {
        getBlogPosts()
    }, [])
    return (
        <>
            <section className="bg-white sm:px-36 py-16">
                {
                    topblog &&
                    <section>
                    <h2 className="text-2xl px-6 sm:text-4xl text-[#213343] font-bold sm:leading-[60px]">{topblog?.title}</h2>
                    <hr className="mt-4"></hr>

                    <div className="flex flex-col sm:flex-row bg-[#F6F8FB] gap-8 items-center mt-10 py-10 px-12">
                        <div className="object-cover">
                        <img src={topblog ? `${topblog?.thumbnail.url}` : ""} width={626} height={626} alt={topblog ? topblog.thumbnail.alt : "thumbnail"}/>
                        </div>

                        <div>
                            <p className="font-sm">Start Reading</p>
                            <p className="font-lg text-[#213343] mt-4" dangerouslySetInnerHTML={{ __html: topblog?.intro }}></p>
                            <Link href={`/blogs/${topblog.id}`}>
                            <button className="font-xl text-[#204ECF] mt-2 flex items-center gap-2">
                              
                                    <p>Continue </p>
                                    <i className="bi bi-arrow-right"></i>
                            </button>
                            </Link>
                        </div>
                    </div>
                </section>

                }
               
                <section className="mt-12">
                    <div className="flex justify-center sm:justify-between items-center">
                        <h2 className="text-[40px]">Top Articles</h2>

                        <div className="text-[#455065] gap-4 hidden sm:flex">
                            <p>SHARE</p>
                            <div className="">
                                <i className="bi bi-share-fill border-2 border-[#DFE3E9] py-3 px-5"></i>
                            </div>

                        </div>
                    </div>

                    <hr className="mt-4"></hr>

                    <section className="grid sm:grid-cols-3 mt-12 gap-10 px-6 sm:px-0">
                        {
                            otherBlogs && otherBlogs.map(data => (
                                <Card sx={{ maxWidth: 375 }} key={data.id}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            // height="140"
                                            image={`${data.thumbnail.url}`}
                                            alt={data.thumbnail.alt}
                                            className="h-[250px] object-contain"
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {data.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <p dangerouslySetInnerHTML={{ __html: data.intro }}></p>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        <Link href={`/blogs/${data.id}`}>
                                            <Button size="small" color="primary" className="flex gap-3 font-lightbold">
                                                <p>Continue </p>
                                                <i className="bi bi-arrow-right"></i>
                                            </Button>
                                        </Link>

                                    </CardActions>
                                </Card>
                            ))

                        }

                    </section>
                </section>
            </section>
            <Footer />
        </>
    )
}
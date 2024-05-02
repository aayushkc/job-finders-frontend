"use client"

import React from 'react'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './emblacarouselbutton'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import Autoplay from 'embla-carousel-autoplay'

const EmblaCarousel = (props) => {
    const { slides, options,delay } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options,[
        Autoplay({ delay: delay })
      ])

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((data,index) => (
                        <div className="embla__slide" key={index}>
                            {/* <div className="embla__slide__number">{index + 1}</div> */}
                            <div className='embla__slide__number'>
                                <div className='flex gap-2 items-center'>
                                    <Image src={data.profilePic} width={64} height={64} alt='profilePic' style={{width:"64px", height:"64px"}}/>
                                    <div>
                                        <h2 className='text-xl'>{data.name}</h2>
                                        <p className='text-[#1D2434B8]'>{data.company}</p>
                                        {data.position && <p className='text-[#1D2434B8]'>{data.position}</p>}
                                    </div>
                                </div>

                                <p className='font-sm sm:font-base text-[#414C61] mt-6 font-normal sm:pr-8 '>
                                    {data.review}
                                </p>
                                {
                                    data.proficient &&  <div className='flex items-start gap-2 mt-4'>
                                    <i className="bi bi-star-fill text-gurkha-yellow"></i>
                                    <div className='text-[#F5752E]'>
                                        <h2 className='font-bold'>Proficient</h2>
                                        <p className='font-normal'>{data.proficient}</p>
                                    </div>
                                
                                    </div>
                                }
                              
                            </div>

                        </div>
                    ))}
                </div>
            </div>



            <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
            <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />


        </section>
    )
}

export default EmblaCarousel

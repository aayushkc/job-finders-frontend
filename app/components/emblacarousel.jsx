"use client"
import Autoplay from 'embla-carousel-autoplay'
import { useCallback, useEffect, useRef } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './emblacarouselbutton'
import Image from 'next/image'


const TWEEN_FACTOR_BASE = 0.25

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max)

const EmblaCarousel = (props) => {
  const { slides, options, delay } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options,[Autoplay({delay:delay})])
  const tweenFactor = useRef(0)
  const tweenNodes = useRef([])

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  const setTweenNodes = useCallback((emblaApi) => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__slide__number')
    })
  }, [])

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length
  }, [])

  const tweenScale = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()
    const slidesInView = emblaApi.slidesInView()
    const isScrollEvent = eventName === 'scroll'

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current)
        const scale = numberWithinRange(tweenValue, 0.7, 1).toString()
        const tweenNode = tweenNodes.current[slideIndex]
        tweenNode.style.transform = `scale(${scale})`
      })
    })
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    setTweenNodes(emblaApi)
    setTweenFactor(emblaApi)
    tweenScale(emblaApi)

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenScale)
      .on('scroll', tweenScale)
      .on('slideFocus', tweenScale)
  }, [emblaApi, tweenScale])

  return (
    <div className="embla my-8">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((data,index) => (
            <div className="embla__slide" key={index}>
                               
                                       <div className='embla__slide__number'>
                                            <div className='flex gap-2 items-center'>
                                                <Image src={data.profilePic} width={64} height={64} alt='profilePic' style={{width:"64px", height:"64px"}} className='object-cover rounded-full'/>
                                                <div>
                                                    <h2 className='text-lg'>{data.name}</h2>
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
       
    </div>
  )
}

export default EmblaCarousel

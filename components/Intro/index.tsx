import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import style from './intro.module.css'

const HEADING = "ANIME-TIME"

const Intro = () => {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)

  function handleClick(event: any) {
    router.push('/dashboard')
  }


  useEffect(() => {
    let intervalId: NodeJS.Timer | null = null

    if (wrapperRef.current !== null) {
      const childs = wrapperRef.current.childNodes

      intervalId = setInterval(() => {
        childs.forEach((element: ChildNode, index: number) => {
          let animation = (element as HTMLSpanElement).animate(
            [
              {transform: `scale3d(1, 1, 1)`},
              {transform: `scale3d(0.7, 1, 1)`},
              {transform: `scale3d(1, 0.7, 1)`},
              {transform: `scale3d(1, 1, 1) translateY(-5px)`},
              {transform: `translateY(0px)`}
            ],
            {
              duration: 300,
              delay: (index * 200),
              fill: `forwards`,
              easing: `ease-in-out`,
            }
          )
        })
      }, 3000)
    }

    return () => {
      intervalId !== null && clearInterval(intervalId)
    }
  }, [])


  return (
    <>
      <div className={style.introWrapper} onClick={handleClick}>
        <div className={style.letterWrapper} ref={wrapperRef}>
          { HEADING.split("").map((letter: string, index: number) => (
            <span 
              key={index} 
              className={style.letter}>
                {letter}
            </span>
          ))}
        </div>
        <div className={style.textWrapper}>
          <p>Tap </p>
          <Image src="/assets/tap.png" width="20" height="20" alt="click" />
          <p>anywhere to get started !!!</p>
        </div>
      </div>
    </>
  )
}

export default Intro
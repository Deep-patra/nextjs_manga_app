import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Loading from '../components/Loading'
import { useRouter } from 'next/router'
import { useTransition, animated, config } from 'react-spring'
import { useState, useEffect } from 'react'
 
function MyApp({ Component, pageProps }: AppProps) {
  const [loading, changeLoadingState] = useState<boolean>(false)

  const router = useRouter()

  useEffect(() => {

    const startHandler = () => {
      changeLoadingState(true)
    }

    const completeHandler = () => {
      changeLoadingState(false)
    }

    router.events.on("routeChangeStart", startHandler)
    router.events.on("routeChangeComplete", completeHandler)

    return () => {
      router.events.off("routeChangeStart", startHandler)
      router.events.off("routeChangeComplete", completeHandler)
    }
  })

  const transition = useTransition(loading, {
    from: { x: 100 },
    enter: { x: 0 },
    leave: { x: -100 },
    config: { duration: 200 },
  })



  return transition(({ x }, loading) => 
    !loading ? 
      <animated.div
        style={{
          transform: x.to(x => { return (x !== 0 ? `translate3d(${x}%, 0, 0)` : 'none') }),
        }}
      >
        <Component { ...pageProps} />
      </animated.div>

      : <animated.div
        style={{
          transform: x.to(x => `translate3d(${x}%, 0, 0)`),
        }}
        className="loadingWrapper"
      >
          <Loading/>
        </animated.div>
  )

}

export default MyApp

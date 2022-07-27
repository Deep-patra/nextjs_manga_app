import { useState, FC, Fragment, useEffect, useRef } from 'react'
import { useTransition, animated } from 'react-spring'
import useSWR from 'swr'
import Image from 'next/image'
import { useSelector, useDispatch } from 'react-redux'
import { changeHomeList } from '../../stores/dashboardStore/actions'
import Item from '../Item'
import CircularProgress from '../CircularProgress'
import style from './homePage.module.css'

interface mangaProps {
  url: string,
  changeLoading: Function,
}



const Error = () => {
  return (
    <div className={style.errorContainer}>
      <div>
        <Image src="/assets/warning.png" priority alt="Warning" width="50px" height="50px" />
        <p>Error while fetching your Mangas...Please check your internet connection !</p>
      </div>
    </div>
  )
}

const Loading = () => {
  return (
    <div className={style.loadingContainer}>
      <div className={style.wrapper}>
        <CircularProgress width={100} height={100} strokeColor={"#9b59b6"} />
        <p>Fetching your mangas..</p>
      </div>
    </div>
  )
}

const fetcher = (url: any) => fetch(url).then(r => r.json())

const Manga: FC<mangaProps> = ({ url, changeLoading }) => {
  const { data, error } = useSWR(url, fetcher)
  const homeManga = useSelector((state: any) => state.homes) || []
  const dispatch = useDispatch()

  useEffect(() => {

    if (data !== null && data !== undefined && data.data !== undefined) {
      let mangas: any[] = data.data
      changeLoading(false)

      if (homeManga.length === 0) {
        dispatch(changeHomeList(mangas))
      }

      else {
        let newList: any[] = [ ...mangas ]
        let mangaList = [ ...homeManga ]

        mangaList.forEach((item: any) => {
          let found = -1

          newList.forEach((mangaItem: any, index: number) => {
            if (mangaItem.id === item.id) found = index
          })

          if (found !== -1) {
            newList.splice(found, 1)
            found = -1
          }
        })


        dispatch(changeHomeList([ ...homeManga, ...newList]))
      }
    }

  }, [data])

  const list = homeManga

  const transition = useTransition(list, {
    from: { transform: 'scale3d(0, 0, 0)' },
    enter: { transform: 'scale3d(1, 1, 1)' },
    leave: { transform: 'scale3d(0, 0, 0) '},
    config: { duration: 200 }
  })

  if (error && list.length === 0)
    return <Error/>

  if ((data === null || data === undefined) && list.length === 0)
    return <Loading/>

  return (
    <div className={style.itemContainer}>
      {
        transition((styles, item) => (
          <animated.div style={styles}>
            <Item data={item} />
          </animated.div>
        ))
      }      
    </div>
  )
  
}

interface homepageProps {
  url: string,
  fetchMangas: Function,
}

const HomePage: FC<homepageProps> = ({ url, fetchMangas }) => {

  const homeManga = useSelector((state: any) => state.homes)
  const [loading, changeState] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {

    function handleScroll(event: any) {
      const element = ref !== null ? ref.current as HTMLDivElement : null

      if (element !== null) {
        const rect = element.getBoundingClientRect()

        if (window.innerHeight >= rect.top) {
          changeState(true)
          fetchMangas()
        }
      }
    }

    window.addEventListener('scroll', handleScroll, true)

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
    }
  }, [])



  return (
    <main className={style.homeContainer}>
      <Manga url={url} changeLoading={changeState} />
      {
        homeManga.length !== 0 ?
        <div className={style.loadingWrapper} ref={ref}>
          <CircularProgress width={50} height={50} strokeColor={"grey"} />
        </div> : null
      }
    </main>
  )
}

export default HomePage
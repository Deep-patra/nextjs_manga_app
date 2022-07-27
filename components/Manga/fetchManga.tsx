import Image from 'next/image'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import CircularLoading from '../CircularProgress'
import Cover from './cover'
import Content from './Content'
import RelatedManga from './RelatedManga'
import style from './manga.module.css'

const fetcher = (args: any) => fetch(args).then(res => res.json())

const Error = () => (
  <div className={style.wrapper}>
    <div>
      <Image src="/assets/warning.png" alt="warning icon" width="50px" height="50px" />
      <p>Error in fetching the manga...Check your internet connection</p>
    </div>
  </div>
)

const Loading = () => (
  <div className={style.wrapper}>
    <div>
      <CircularLoading width={100} height={100} strokeColor={"#9b59b6"} />
      <p>fetching the manga metadata...</p>
    </div>
  </div>
)



const Manga = () => {
  
  const router = useRouter()
  const { id } = router.query

  const { data, error } = useSWR(`/api/manga/${id}`, fetcher)

  if (error) return <Error/>

  if (data === null || data === undefined) return <Loading/>

  return (
    <div className={style.gridContainer}>
      <div className={style.pictureWrapper}>
        <Cover data={data.data} />
      </div>

      <div className={style.descriptionWrapper}>
        <Content manga={data.data} />
        <RelatedManga manga={data.data} />
      </div>

    </div>
  )
}


export default Manga
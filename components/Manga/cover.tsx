import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import CircularLoading from '../CircularProgress'
import style from './manga.module.css'

interface CoverProps {
  data: any,
}


const Cover: FC<CoverProps> = ({ data }) => {

  const [src, setSrc] = useState<string>("")
  
  useEffect(() => {
    async function getCover() {
      let cover_id = ""

      data.relationships.forEach((item: any) => {
        if (item.type === 'cover_art') cover_id = item.id
      })

      if (cover_id !== null) {
        const response: Response | void = await fetch(`/api/cover/${cover_id}`)
          .catch(err => { console.log(err) })

        if (response !== null && response !== undefined) {
          if (response.status === 200) {
            const res = await response.json()

            const filename = res.data.attributes.fileName

            if (filename !== null && filename !== undefined) {
              setSrc(`https://uploads.mangadex.org/covers/${data.id}/${filename}`)
            }
          }
        }

      }
    }

    getCover()
  }, [])

  return (
    <>
      <div className={style.imageWrapper}>
        { src !== "" ?
            <Image
            src={src}
            alt={"manga cover"}
            layout="fill"
            priority
          />
          : <CircularLoading width={50} height={50} strokeColor={"gray"} />
        }
      </div>

      <div className={style.headingWrapper}>
        <p>{data.attributes.title.en}</p>
      </div>

      <div className={style.infoWrapper}>
        <span>Status</span>
        <span>{data.attributes.status}</span>
      </div>

      <div className={style.infoWrapper}>
        <span>Rating</span>
        <span>{data.attributes.contentRating}</span>
      </div>

      <div className={style.infoWrapper}>
        <span>Created at</span>
        <span>{new Date(Date.parse(data.attributes.createdAt)).toDateString()}</span>
      </div>
    </>
  )
}

export default Cover
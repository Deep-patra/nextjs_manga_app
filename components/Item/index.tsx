import { FC, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import CircularProgress from '../CircularProgress'
import style from './item.module.css'

interface Tag {
  id: string,
  type: string,
  attributes: {
    name: any,
    description: any,
    group: string,
    version: number,
  }
}

interface Relationship {
  id: string,
  type: string,
  related: string,
  attributes: {}
}

interface ItemProps {
  data: {
    id: string,
    type: string,
    attributes: {
      title: any,
      altTitles: any[],
      description: any,
      links: any,
      originalLanguage: string,
      lastVolume: string,
      lastChapter: string,
      publicationDemographic: string,
      status: string,
      tags: Tag[],
    },
    relationships: Relationship[]
  },
}

const Item: FC<ItemProps> = ({ data }) => {

  const [image, changeImage] = useState<string>("")
  const [loading, changeLoadingState] = useState<boolean>(true)

  useEffect(() => {
    async function fetchCover() {
      if (data.relationships !== undefined) {
        const cover_art_ID: any = data.relationships.find((item: Relationship) => {
          if (item.type === "cover_art") return true
          return false
        })
  
<<<<<<< HEAD
        const response = await fetch(`/api/cover/${cover_art_ID.id}`, {
=======
        const response = await fetch(`https://api.mangadex.org/cover/${cover_art_ID.id}`, {
>>>>>>> 30d751c1f1d194aec065be2d32b36718e7ac33af
          mode: 'cors',
          credentials: 'include',
        })
          .then(res => res.json())
          .then(res => {
            if (res.data) {
              const filename = res.data.attributes.fileName
    
              if (filename !== null && filename !== undefined)
                changeImage(`https://uploads.mangadex.org/covers/${data.id}/${filename}`)
            }
          })
          .catch(err => { return })
      }
    }

    fetchCover()
  })

  const handleLoadingStatus = ()  => {
    changeLoadingState(false)
  }

  function animateOnClick(event: any) {
    const animation = event.target.animate(
      [{ transform: "scale3d(0.9, 0.9, 1)" }],
      {
        duration: 200,
        easing: 'linear',
      }
    )
  }

  return (
    <Link href={`/manga/${data.id}`} title={data.attributes.title.en}>
      <div className={style.item}>
        <div className={style.imageContainer}  onClick={animateOnClick}>
          {
            loading ?
              <CircularProgress width={50} height={50} strokeColor={"#9b59b6"} />
            : null
          }
          {
            image !== "" ?
            <Image
              alt={"cover art"}
              src={image}
              layout="fill"
              onLoadingComplete={handleLoadingStatus}
              priority
              onError={ () => changeImage("/assets/image-error.png") }
            />
            : <CircularProgress width={50} height={50} strokeColor={"grey"} />
          }
        </div>
        <div className={style.titleContainer}>
          <p>{data.attributes.title.en}</p>
        </div>
      </div>
    </Link>
  )
}


export default Item
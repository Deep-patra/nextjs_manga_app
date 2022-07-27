import { useState, FC, useEffect } from 'react'
import Item from '../../Item'
import CircularProgress from '../../CircularProgress'
import style from './relatedManga.module.css'


interface RelatedMangaProps {
  manga: any,
}

const generateIncludeTagsQuery = (tags: any[]): string => {
  let queryString = ""

  tags.forEach((tag: any, index: number) => {
    queryString += `includeTags[]=${tag.id}`
    if (index !== (tags.length - 1)) queryString += "&"
  })

  return queryString
}

const RelatedManga: FC<RelatedMangaProps> = ({ manga }) => {
  
  const [mangas, changeMangas] = useState<any[]>([])

  useEffect(() => {
    const tags = manga.attributes.tags || []
    const contentRating = manga.attributes.contentRating || "safe"

    if (tags.length > 0) {
      fetch(`/api/manga?limit=10&contentRating[]=${contentRating}&${generateIncludeTagsQuery(tags)}`)
        .then(res => res.json())
        .then(res => {
          const { data } = res

          if (data !== null && data !== undefined && data.length !== 0) {
            changeMangas(data)
          }
        })
        .catch(err => console.log(err))
    }
  }, [])
  
  return (
    <div className={style.relatedMangaContainer}>
      <div className={style.relatedMangaHeading}>You may still like..</div>
      <div className={style.relatedMangaWrapper}>
        {
          mangas.length !== 0 ?
            (
              <>
                {
                  mangas.map((item: any, index: number) => (
                    <Item data={item} key={index} />
                  ))
                }
              </>
            )
            : <CircularProgress width={40} height={40} strokeColor={"grey"} />
        }
      </div>
    </div>
  )
}

export default RelatedManga
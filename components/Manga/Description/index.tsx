import { FC, useEffect, useState } from 'react'
import Item from '../../Item'
import style from './description.module.css'

interface DescriptionProps {
  manga: any
}

interface RelatedMangaProps {
  manga: any
}

const RelatedManga: FC<RelatedMangaProps> = ({ manga }) => {
  
  const relatedMangas = manga.relationships.filter((item: any, index: number) => {
    if (item.type === "manga") return true

    return false
  })

  return (
    <>
      {
        relatedMangas.length !== 0 ?
        (
          <div className={style.relatedMangaContainer}>
            <span className={style.relatedMangaHeading}>Related Manga</span>
            <div className={style.relatedMangaWrapper}>
            { 
              relatedMangas.map((item: any, index: number) => (
                <FetchManga key={index} mangaId={item.id} />
              ))
            }
            </div>
          </div>
        )
        : null
      }
    </>
  )
}


interface FetchMangaprops {
  mangaId: string,
}

const FetchManga:FC<FetchMangaprops> = ({ mangaId }) => {

  const [data, changeData] = useState<any>(null)

  useEffect(() => {
 
    const Fetch = () => {
      fetch(`/api/manga/${mangaId}`)
      .then(res => res.json())
      .then((res: any) => {

        if (res.data === undefined) throw new Error ("Response data is undefined")

        changeData(res.data)
      })
      .catch(err => console.log(err))
    }

    if (mangaId !== undefined) Fetch()
    
  }, [mangaId])

  return (
    <>
      {
        data  ? 
          <Item data={data} />
        : null
      }
    </>
  )
}

const Description: FC<DescriptionProps> = ({ manga }) => {

  return (
    <div className={style.descriptionContainer} >
      <div>
        <span className={style.paragraphHeading}>Title</span>
        <p>{manga.attributes.title.en}</p>
      </div>

      <div>
        <span className={style.paragraphHeading}>Alternate Titles</span>
        <div className={style.altTitleWrapper}>
        {
          manga.attributes.altTitles.map((item: any, index: number) => (
            <p key={index}>{`${Object.values(item)}`}, </p>
          ))
        }
        </div>
      </div>

      <div>
        <span className={style.paragraphHeading}>Description</span>
        <p>
          {
            manga.attributes.description.en
          }
        </p>
      </div>

      <div>
        <span className={style.paragraphHeading}>Last chapter</span>
        <p>{manga.attributes.lastChapter}</p>
      </div>

      <div>
        <span className={style.paragraphHeading} >Publication Demographic</span>
        <p>{manga.attributes.publicationDemographic}</p>
      </div>

      <div>
        <span className={style.paragraphHeading} >Content Rating</span>
        <p>{manga.attributes.contentRating}</p>
      </div>

      <div>
        <span className={style.paragraphHeading} >Created At</span>
        <p>{new Date(Date.parse(manga.attributes.createdAt)).toLocaleString()}</p>
      </div>

      <div>
        <span className={style.paragraphHeading}>Updated At</span>
        <p>{new Date(Date.parse(manga.attributes.updatedAt)).toLocaleString()}</p>
      </div>

      <div className={style.tagWrapper}>
        <span className={style.paragraphHeading}>Tags</span>
        {
          manga.attributes.tags.map((item: any, index: number) => (
            <span key={index} className={style.tag}>
              <p>{item.attributes.name.en}</p>
            </span>
          ))
        }
      </div>

      <RelatedManga manga={manga} />

    </div>
  )
}


export default Description
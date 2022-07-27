import { useState, FC, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { changeChapterList } from '../../../stores/mangaStore/actions'
import Chapters from '../Chapters'
import Description from '../Description'
import style from './content.module.css'

interface ActiveProps {
  description: boolean,
  chapters: boolean,
}

const defatultState = {
  description: false,
  chapters: false,
}

interface ContentProps {
  manga: any
}

const Content: FC<ContentProps> = ({ manga }) => {
  
  const dispatch = useDispatch()
  const [active, changeActive] = useState<ActiveProps>({
    description: true,
    chapters: false,
  })

  const toggleDescription = () => {
    changeActive({
      ...defatultState,
      description: true,
    })
  }

  const toggleChapters = () => {
    changeActive({
      ...defatultState,
      chapters: true,
    })
  }

  useEffect(() => {
    async function fetchChapters() {
      return fetch(`/api/manga/${manga.id}/aggregate`)
        .then(res => res.json())
        .then(res => {
          
          if (res.data === null) throw new Error ('response is not ok')

          return res.data

        })
        .catch(err => console.log(err))
    }

    fetchChapters()
    .then((res: any) => {
      let chapters: any[] = []

      Array.from(Object.values(res)).map((volume: any) => {
        chapters.push.apply(chapters, Object.values(volume.chapters))
      })

      dispatch(changeChapterList(chapters))
    })
    .catch(err => console.log(err))
  
  }, [])
  
  return (
    <div className={style.contentWrapper}>
      <div className={style.buttonWrapper}>
        <button
          onClick={toggleDescription}
          className={active.description ? style.active : ""}
        >
          Description
        </button>
        <button
          onClick={toggleChapters}
          className={active.chapters ? style.active : ""}
        >
          Chapters
        </button>
      </div>
      <div className={style.contentContainer}>
        {
        active.description ? 
          <Description manga={manga} />
          : null
        }

        {
          active.chapters ?
          <Chapters manga={manga} />
          : null
        }
      </div>
    </div>
  )
}

export default Content
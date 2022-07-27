import HeartIcon from './heartIcon'
import AppsIcon from './appsIcon'
import PlayIcon from './playIcon'
import FAB from '../../FloatingButton'
import style from './actionButton.module.css'
import { FC, useEffect, useState, MouseEventHandler } from 'react'
import { useRouter } from 'next/router'
import type { Manga } from '../../../types/mangaType'
import { toggleFavourite } from '../../../stores/mangaStore/actions'
import { useDispatch, useSelector } from 'react-redux'


interface FavouriteButtonProps {
  isFav: boolean,
  toggleFav: Function,
}

const FavouriteButton: FC<FavouriteButtonProps> = ({ isFav, toggleFav }) => {

  return (
    <button
      className={`${style.favouriteButton} ${isFav ? style.fav : ""}`}
      onClick={toggleFav as MouseEventHandler}
    >
      <HeartIcon/>
      {
        isFav ?
        "Added" :
        "Add to favourites"
      }
    </button>
  )
}

interface ReadButtonProps {
  handleRead: Function,
}


const ReadButton: FC<ReadButtonProps> = ({ handleRead }) => {

  return (
    <button className={style.readButton} onClick={handleRead as MouseEventHandler}>
      <PlayIcon/>
      Read
    </button>
  )
}

const ButtonElement = () => {
  return (
    <span>
      <AppsIcon/>
    </span>
  )
}

interface HidddenDialogProps {
  isFavourite: boolean,
  toggleFav: Function,
  handleRead: Function,
}

const HiddenDialog: FC<HidddenDialogProps> = ({ isFavourite, toggleFav, handleRead }) => {

  return (
    <div className={style.buttonWrapper}>
      <ReadButton handleRead={handleRead} />
      <FavouriteButton isFav={isFavourite} toggleFav={toggleFav} />
    </div>
  )
}

interface ActionButtonProps {
  mangas: Manga[]
}

const ActionButton: FC<ActionButtonProps> = ({ mangas }) => {

  const router = useRouter()
  const { id } = router.query
  const [isFavourite, changeFavourite] = useState<boolean>(false)
  const [nextChapterURL, changeURL] = useState<string>("")
  const chapters = useSelector((state: any) => state.chapters)
  const dispatch = useDispatch()


  useEffect(() => {
    
    function checkIfFavaourite(id: string) {
      
      if (mangas !== null && mangas.length !== 0) {
        mangas.map((item: Manga) => {

          if (item.id !== id) return 

          changeFavourite(item.isFavourite)
        })
      }

    }

    // check if the manga is favourite or not
    checkIfFavaourite(id as string)

  }, [mangas])


  useEffect(() => {

    function generateURL() {
      let chapterIndex: number = 0

      if (chapters.length === 0) return `/manga/${id}/read_chapter/1`

      mangas.map((manga: any) => {
        if (manga.id === id) {
          
          if (manga.lastReadChapter !== null) {
            // find the chapter with same id
            chapters.map((chapter: any, index: number) => {
              if (chapter.id !== manga.lastReadChapter) return 

              if (index === chapters.length - 1) chapterIndex = index

              chapterIndex = index + 1
            })

          }

        }
      })

      const chapter = chapters[chapterIndex]

      const URL = `/manga/${id}/read_chapter/${chapter.chapter}`
      return URL
    }

    changeURL(generateURL())

  }, [])


  function toggleMangaFavourite(event: any) {
    dispatch(toggleFavourite(id as string)) // dispatch the action to the store
  }

  const handleRead = () => {
    if (nextChapterURL === "") {
      router.push(`/manga/${id}/read_chapter/1`)
      return
    }

    router.push(nextChapterURL)
  }


  return (
    <FAB
      span={<ButtonElement/>}
      HiddenComp={<HiddenDialog isFavourite={isFavourite} handleRead={handleRead} toggleFav={toggleMangaFavourite} />}
    />
  )
}


export default ActionButton
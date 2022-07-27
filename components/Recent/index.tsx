import { FC } from 'react'
import { useSelector } from 'react-redux'
import type { Manga } from '../../types/mangaType'
import RecentContainer from './RecentContainer'
import style from './recent.module.css'


const NoRecents = () => (
  <div className={style.noRecentWrapper}>
    <p>No Recents yet !!</p>
  </div>
)

interface ShowRecentsProps {
  mangas: Manga[]
}


const ShowRecents: FC<ShowRecentsProps> = ({ mangas }) => {
  return (
    <RecentContainer mangas={mangas}/>
  )
}


const Recent = () => {
  const mangas = useSelector((state: any) => state.mangas)

  return (
    <div className={style.recentsWrapper}>
      {
        mangas.length !== 0 ? 
        <ShowRecents mangas={mangas} />
        : <NoRecents/>
      }
    </div>
  )
}

export default Recent
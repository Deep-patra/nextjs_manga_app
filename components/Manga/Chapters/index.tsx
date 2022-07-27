import { FC } from 'react'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import style from './chapters.module.css'

interface chapterType {
  manga: any
}

interface ChapterItemProps {
  chapter: any,
  mangaId: string,
}

const ChapterItem: FC<ChapterItemProps> = ({ chapter, mangaId }) => {
  return (
    <div className={style.chapterItemWrapper}>
      <Link href={`/manga/${mangaId}/read_chapter/${chapter.chapter}`}>
        {`Chapter ${chapter.chapter}`}
      </Link>
    </div>
  )
}


const Chapters: FC<chapterType> = ({ manga }) => {

  const chapters = useSelector((state: any) => state.chapters)

  return (
    <div className={style.chaptersWrapper}>
      <div>
        <span className={style.chapterHeadingWrapper}>Total chapters:</span>
        <span className={style.chapterCountWrapper}>{chapters.length}</span>
      </div>

      {
        chapters.map((chapter: any, index: number) => (
          <ChapterItem key={index} chapter={chapter} mangaId={manga.id} />
        ))
      }

    </div>
  )
}

export default Chapters
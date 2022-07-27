import Item from '../../Item'
import type { Manga } from '../../../types/mangaType'
import { FC } from 'react'
import useSWR from 'swr'
import CircularLoading from '../../CircularProgress'


interface RecentsMangaProps {
  mangas: Manga[],
}

const generateURL = (mangas: Manga[]): string => {
  let queryString = '/api/manga?'

  mangas.forEach((manga: Manga) => {
    queryString += `ids[]=${manga.id}`
  })

  return queryString
}

const fetcher = (args: any) => fetch(args).then(res => res.json())

const RecentsManga: FC<RecentsMangaProps> = ({ mangas }) => {
  const { data, error } = useSWR(generateURL(mangas), fetcher)

  if (!data) return <CircularLoading width={50} height={50} strokeColor={"gray"} />

  const recents = data !== null ? data.data : []

  return (
    <>
      {
        recents.length !== 0 ?
        (
          <>
            {
              recents.map((manga: any, index: number) => (
                <Item data={manga} key={index} />
              ))
            }
          </>
        )
        : null
      }
    </>
  )
}

export default RecentsManga
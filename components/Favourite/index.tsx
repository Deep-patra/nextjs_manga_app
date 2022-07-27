import { FC } from 'react'
import { useSelector } from 'react-redux'
import Image from 'next/image'
import useSWR from 'swr'
import Item from '../Item'
import type { Manga } from '../../types/mangaType'
import style from './favourite.module.css'
import CircularLoading from '../CircularProgress'

interface FavouriteItemProps {
  url: string
}

const fetcher = (args: any) => fetch(args).then(res => res.json())

const FavouriteItem: FC<FavouriteItemProps> = ({ url }) => {
  const { data, error } = useSWR(url, fetcher)

  if (!data) return <CircularLoading width={50} height={50} strokeColor={"gray"}/>

  if (error) 
    return (
      <div>
        <Image
          src="/assets/warning.png"
          alt={"Error in fetching the mangas"}
          width="100"
          height="100"
          priority
        />
        <p>Error in fetching your Favourites Mangas..</p>
      </div>
    )

    const favourites = data !== null ? data.data : []

    return (
      <>
        {
          favourites.length !== 0 ?
          (
            <>
              {
                favourites.map((manga: any, index: number) => (
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


interface showFavouritesProps {
  favourites: Manga[]
}

const generateURL = (favourites: Manga[]): string => {
  if (favourites.length === 0) return ""

  let baseURL = '/api/manga?'

  favourites.forEach((manga: Manga) => {
    baseURL += `ids[]=${manga.id}`
  })

  return baseURL
}

const ShowFavourites: FC<showFavouritesProps> = ({ favourites }) => {

  let url = generateURL(favourites)

  return (
    <div className={style.favouriteItemContainer}>
      <FavouriteItem url={url} />
    </div>
  )
} 

const NoFavourites = () => (
  <div className={style.noFavouriteWrapper}>
    <p>No Favourites yet !!</p>
  </div>
)

const Favourite = () => {
  
  const mangas = useSelector((state: any) => state.mangas)
  let favourites: Manga[] = []

  if (mangas.length !== 0) {
    mangas.forEach((manga: Manga) => {
      if (manga.isFavourite) favourites.push(manga)
    })
  }

  return (
    <div className={style.favouriteWrapper}>
      {
        favourites.length !== 0 ?
        <ShowFavourites favourites={favourites} />
        : <NoFavourites/>
      }
    </div>
  )
}


export default Favourite
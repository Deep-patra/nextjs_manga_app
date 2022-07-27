import { useEffect, useState } from 'react'
import { useRouter } from 'next/router' 
import Container from '../Container'
import Header from '../Header'
import ActionButton from './ActionButton'
import FetchManga from './fetchManga'
import { useDispatch, useSelector } from 'react-redux'
import type { Manga } from '../../types/mangaType'
import { changeMangaList, addManga } from '../../stores/mangaStore/actions'


const Manga = () => {

  const dispatch = useDispatch()
  const router = useRouter()
  const mangas = useSelector((state: any) => state.mangas)

  const { id }= router.query

  useEffect(() => {
    function fetchMangasFromStorage() {
      const mangasJSON = localStorage.getItem('MANGAS')

      if (mangasJSON !== null) {

        try {
          const newMangas = JSON.parse(mangasJSON)

          dispatch(changeMangaList(newMangas))

        } catch(err) {
          console.log(err)
        }

      }
    }

    fetchMangasFromStorage()
  }, [])

  useEffect(() => {
    // update the json value in local storage
    localStorage.setItem("MANGAS", JSON.stringify(mangas))
  }, [mangas])

  useEffect(() => {
    const mangaId = id as string

    const manga: Manga = {
      id: mangaId,
      lastRead: Date.now().toString(),
      lastReadChapter: null,
      readChapters: [],
      isFavourite: false,
    }

    dispatch(addManga(manga))
  }, [])

  return (
    <Container>
      <Header toggleMenu={() => {}} toggleSearch={() => {}} showButton={false} />
      <FetchManga/>
      <ActionButton mangas={mangas} />
    </Container>
  )
}

export default Manga
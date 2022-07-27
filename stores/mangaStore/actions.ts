import { createAction } from '@reduxjs/toolkit'
import type { Manga } from '../../types/mangaType'

const changeMangaList = createAction('CHANGE_MANGA_LIST', (items: Manga[]) => {
  return {
    payload: {
      items,
    }
  }
})

const addManga = createAction('ADD_MANGA', (item: Manga) => {
  return {
    payload: {
      item
    }
  }
})

const removeManga = createAction('REMOVE_MANGA', (item: Manga) => {
  return {
    payload: {
      item
    }
  }
})

const toggleFavourite = createAction('TOGGLE_FAVOURITE', (id: string) => {
  return {
    payload: {
      id
    }
  }
})


const changeChapterList = createAction('CHANGE_CHAPTERS_LIST', (chapters: any[]) => {
  return {
    payload: {
      chapters,
    }
  }
})


export {
    changeMangaList,
    addManga,
    removeManga,
    toggleFavourite,
    changeChapterList,
}
import { createReducer } from '@reduxjs/toolkit'
import type { Manga } from '../../types/mangaType'


interface StateType {
  mangas: Manga[],
  chapters: any[],
}

const initialState: StateType = {
  mangas: [],
  chapters: []
}


const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase('CHANGE_MANGA_LIST', (state, action: any) => {
      return { ...state, mangas: action.payload.items }
    })

    .addCase('ADD_MANGA', (state, action: any) => {
      return { ...state, manga: state.mangas.concat(action.payload.item)}
    })

    .addCase('REMOVE_MANGA', (state, action: any) => {
      let newList = state.mangas
      let manga = action.payload.item

      state.mangas.map((item: Manga, index) => {
        if (item.id === manga.id) {
          newList.splice(index, 1)
        }
      })

      return { ...state, mangas: newList }
    })

    .addCase('TOGGLE_FAVOURITE', (state, action: any) => {

      let id = action.payload.id
      let found = false

      state.mangas.forEach((item: Manga, index: number) => {
        if (id === item.id) {
          found = true

          item.isFavourite = !item.isFavourite
        }
      })

      if (!found) {
        let item: Manga = {
          id,
          isFavourite: true,
          lastRead: "",
          readChapters: [],
          lastReadChapter: null,
        }

        return { ...state, mangas: state.mangas.concat(item)}
      }
    })

    .addCase('CHANGE_CHAPTERS_LIST', (state, action: any) => {
      return { ...state, chapters: action.payload.chapters }
    })

})

export default reducer
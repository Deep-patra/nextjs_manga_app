import { createAction } from '@reduxjs/toolkit'

const changeStatus = createAction("CHANGE_STATUS", (status_list: any) => {
  return {
    payload: {
      status_list,
    }
  }
})

const changeRating = createAction("CHANGE_RATING", (rating_list) => {
  return {
    payload: {
      rating_list,
    }
  }
})

const changeDemographic = createAction("CHANGE_DEMOGRAPHIC", (demographic_list) => {
  return {
    payload: {
      demographic_list,
    }
  }
})

const changeIncludeTags = createAction("CHANGE_INCLUDE_TAG", (includeTag_list) => {
  return {
    payload: {
      includeTag_list,
    }
  }
})

const changeExcludeTags = createAction("CHANGE_EXCLUDE_TAG", (excludeTag_list) => {
  return {
    payload: {
      excludeTag_list
    }
  }
})

const changeHomeList = createAction("CHANGE_HOME_LIST", (homes) => {
  return {
    payload: {
      homes
    }
  }
})

const changeMangasList = createAction("CHANGE_MANGAS_LIST", (mangas) => {
  return {
    payload: {
      mangas,
    }
  }
})

export {
  changeStatus,
  changeRating,
  changeDemographic,
  changeIncludeTags,
  changeExcludeTags,
  changeHomeList,
  changeMangasList,
}
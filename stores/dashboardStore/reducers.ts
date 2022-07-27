import { Status } from '../../api_types/status'
import { ContentRating } from '../../api_types/contentRating'
import Tag from '../../api_types/tag'
import { PublicationDemographic } from '../../api_types/demographic'
import { createReducer } from '@reduxjs/toolkit'


const STATUS_LIST = [
  { type: Status.ONGOING, selected: true },
  { type: Status.COMPLETED, selected: true },
  { type: Status.CANCELLED, selected: true },
  { type: Status.HIATUS, selected: true },
]

const RATING_LIST = [
  { type: ContentRating.SAFE, selected: true },
  { type: ContentRating.SUGGESTIVE, selected: false },
  { type: ContentRating.EROTICA, selected: false },
  { type: ContentRating.PORNOGRAPHIC, selected: false },
]

const DEMOGRAPHIC_LIST = [
  { type: PublicationDemographic.SHOUNEN, selected: false },
  { type: PublicationDemographic.SHOUJO, selected: false },
  { type: PublicationDemographic.JOSEI, selected: false },
  { type: PublicationDemographic.SEINEN, selected: false },
]


const TAG_LIST = Tag.map((item: any, index: number) => {
  const ID = item.id
  const NAME = item.attributes.name.en

  return { id: ID, type: NAME, selected: false }
})

const initialState = {
  status: STATUS_LIST,
  rating: RATING_LIST,
  demographic: DEMOGRAPHIC_LIST,
  includeTags: TAG_LIST,
  excludeTags: TAG_LIST,
  homes: [],
  mangas: [],
}

const REDUCER = createReducer(initialState, (builder) => {
  builder
    .addCase("CHANGE_STATUS", (state, action: any) => {
      return { ...state, status: action.payload.status_list }
    })

    .addCase("CHANGE_RATING", (state, action: any) => {
      return { ...state, rating: action.payload.rating_list}
    })

    .addCase("CHANGE_DEMOGRAPHIC", (state, action: any) => {
      return { ...state, demographic: action.payload.demographic_list }
    })

    .addCase("CHANGE_INCLUDE_TAG", (state, action: any) => {
      return { ...state, includeTags: action.payload.includeTag_list }
    })

    .addCase("CHANGE_EXCLUDE_TAG", (state, action: any) => {
      return { ...state, excludeTags: action.payload.excludeTag_list }
    })

    .addCase("CHANGE_HOME_LIST", (state, action: any) => {
      return { ...state, homes: action.payload.homes }
    })

    .addCase("CHANGE_MANGAS_LIST", (state, action: any) => {
      return { ...state, mangas: action.payload.mangas }
    })
})

export default REDUCER
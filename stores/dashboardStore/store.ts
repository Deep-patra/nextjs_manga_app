import { configureStore } from '@reduxjs/toolkit'
import REDUCER from './reducers'

const STORE = configureStore({
  reducer: REDUCER,
})



export default STORE

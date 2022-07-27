import { NextPage } from 'next'
import { Provider } from 'react-redux'
import Manga from '../../../components/Manga'
import store from '../../../stores/mangaStore/store'


const Page: NextPage = () => {
  return (
    <Provider store={store}>
      <Manga/>
    </Provider>
  )
}

export default Page
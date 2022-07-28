import type { NextPage } from 'next'
import { useState, useEffect, useRef } from 'react'
import { Provider, useSelector, useDispatch } from 'react-redux'
import Store from '../../stores/dashboardStore/store'
import { changeMangasList } from '../../stores/dashboardStore/actions'
import { useTransition, animated } from 'react-spring'
import Container from '../../components/Container'
import Header from '../../components/Header'
import Menu from '../../components/Menu'
import Sidebar from '../../components/Sidebar'
import Search from '../../components/Search'
import HomePage from '../../components/HomePage'
import Recent from '../../components/Recent'
import Favourite from '../../components/Favourite'
import style from '../../styles/dashboard.module.css'


interface ActivePage {
  homepage: boolean,
  recent: boolean,
  favourite: boolean,
}

const defaultActivePage: ActivePage = {
  homepage: false,
  recent: false,
  favourite: false,
}

function getURLString(query: string, values: any): string {
  let queryString = ""

  values.forEach((item: any, index: number) => {
    if (item.selected === true) {
      queryString += `${query}[]=${item.type}`
      index !== (values.length - 1) && (queryString += '&')
    }
  })

  return queryString
}



const Dashboard = () => {

  const dispatch = useDispatch()

  const [open, toggle] = useState<boolean>(false)
  const [openSearch, toggleSearch] = useState<boolean>(false)
  const [pageStatus, togglePage] = useState<ActivePage>({
    homepage: true,
    recent: false,
    favourite: false,
  })
  const OFFSET = useRef<number>(0)
  const LIMIT = useRef<number>(10)

  const [URL, changeURL] = useState<string>(`/api/manga?limit=${LIMIT.current}&offset=${OFFSET.current}`)
  const sliderRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)


  const [status_list, rating_list, demographic_list, includedTagList, excludedTagList, homesList]: any = useSelector((state: any)=> {
    return [state.status, state.rating, state.demographic, state.includeTags, state.excludeTags, state.homes]
  })


  const transition = useTransition(open, {
    from: { width: 0 },
    enter: { width: 180 },
    leave: { width: 0 },
  })

  const searchTransition = useTransition(openSearch, {
    from: { maxHeight: "0%" },
    enter: { maxHeight: "100%" },
    leave: { maxHeight: "0%" },
  })

  const handleMenuToggle = () => {
    toggle(!open)
  }

  const closeMenu = () => {
    toggle(false)
  }

  const handleSearchToggle = () => {
    toggleSearch(!openSearch)
  }

  const toggleHomePage = () => {
    togglePage({ ...defaultActivePage, homepage: true })
  }

  const toggleRecent = () => {
    togglePage({ ...defaultActivePage, recent: true })
  }

  const toggleFavourite = () => {
    togglePage({ ...defaultActivePage, favourite: true })
  }

  const fetchMangas = () => {

    let baseURL = "/api/manga?"
    baseURL += `limit=${LIMIT.current}&offset=${OFFSET.current}`
    const status = getURLString("status", status_list)
    const rating = getURLString("rating", rating_list)
    const demographic = getURLString("publicationDemographic", demographic_list)
    const includedTag = getURLString("includedTags", includedTagList)
    const excludedTag = getURLString("excludedTags", excludedTagList)

    status.length !== 0 && ( baseURL += `&${status}`)
    rating.length !== 0 && ( baseURL += `&${rating}`)
    demographic.length !== 0 && (baseURL += `&${demographic}`)
    includedTag.length !== 0 && (baseURL += `&${includedTag}`)
    excludedTag.length !== 0 && (baseURL += `&${excludedTag}`)


    OFFSET.current += LIMIT.current // update the offset
    changeURL(baseURL)
  }

  // reset the limit and offset when homeList gets empty 
  useEffect(() => {
    if (homesList.length !== OFFSET.current) {
      OFFSET.current = homesList.length
    }
  }, [homesList])

  // fetch the mangas from the localstorage 
  useEffect(() => {
    const mangasJSON = localStorage.getItem("MANGAS")

    if (mangasJSON !== null) {
      try {
        const mangas = JSON.parse(mangasJSON)

        dispatch(changeMangasList(mangas))
      } catch(err) {
        console.log(err)
      }
    }
    
  }, [])

  useEffect(() => {
    const handleClickAway = (event: any) => {
      const path = event.composedPath()

      if (!path.includes(buttonRef.current) && !path.includes(sliderRef.current)) {
        closeMenu()
      }
    }

    document.addEventListener('click', handleClickAway, false)

    return () => {
      document.removeEventListener('click', handleClickAway, false)
    }
  })

  return (
    <>
      <Container>
        <Header toggleMenu={handleMenuToggle} toggleSearch={handleSearchToggle} ref={buttonRef} showButton={true} />
        
        {searchTransition((styles, openSearch) => (
          openSearch ? 
            <animated.div style={{ ...styles }} className={style.searchWrapper}>
              <Search/>
            </animated.div>
            : null
        ))}

        <div className={style.menuWrapper}>
          <Menu
            pageStatus={pageStatus}
            toggleHomePage={toggleHomePage}
            toggleRecent={toggleRecent}
            toggleFavourite={toggleFavourite}
            changeURL={changeURL}
            fetchMangas={fetchMangas}
          />
        </div>

        { pageStatus.homepage ? <HomePage url={URL} fetchMangas={fetchMangas} /> : null }
        { pageStatus.recent ? <Recent/> : null }
        { pageStatus.favourite ? <Favourite/> : null }
      </Container>
      {
        transition((styles, open) => (
          open ? <animated.div style={styles} className={style.slider}>
            <Sidebar ref={sliderRef}>
              <Menu
                pageStatus={pageStatus}
                toggleHomePage={toggleHomePage}
                toggleRecent={toggleRecent}
                toggleFavourite={toggleFavourite}
                changeURL={changeURL}
                fetchMangas={fetchMangas}
              />
            </Sidebar>
          </animated.div> : null
        ))
      }
    </>
  )
}


const Page: NextPage = () => {
  return (
    <Provider store={Store}>
      <Dashboard/>
    </Provider>
  )
}


export default Page
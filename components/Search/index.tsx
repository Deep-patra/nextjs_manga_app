import Link from 'next/link'
import { FC, useRef, useState, useEffect } from 'react'
import style from './search.module.css'
import CircularLoading from '../CircularProgress'

const CloseIcon = () => {
  return (
    <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="20px" height="20px">
      <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"/>
    </svg>
  )
}

const SearchIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="30px" height="30px">
      <path fill="#616161" d="M34.6 28.1H38.6V45.1H34.6z" transform="rotate(-45.001 36.586 36.587)"/>
      <path fill="#616161" d="M20 4A16 16 0 1 0 20 36A16 16 0 1 0 20 4Z"/>
      <path fill="#37474F" d="M36.2 32.1H40.2V44.400000000000006H36.2z" transform="rotate(-45.001 38.24 38.24)"/>
      <path fill="#64B5F6" d="M20 7A13 13 0 1 0 20 33A13 13 0 1 0 20 7Z"/>
      <path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"/>
    </svg>
  )
}

interface SearchResultsProps {
  results: any[],
}

const SearchResults: FC<SearchResultsProps> = ({ results }) => {
  return (
    <>
      {
        results.map((result: any, index: number) => (
          <div key={index} className={style.resultItem}>
            <Link href={`/manga/${encodeURI(result.id)}`}>
              {result.attributes.title.en}
            </Link>
          </div>
        ))
      }
    </>
  )
}


const SearchBar = () => {

  const buttonRef = useRef<HTMLButtonElement>(null)
  const [value, changeValue] = useState<string>("")
  const [results, changeResults] = useState<any[]>([])
  const [loading, changeLoadingStatus] = useState<boolean>(false)
  const searchBarRef = useRef<HTMLDivElement>(null)

  const searchText = () => {
    fetch(`/api/search?title=${encodeURI(value)}`)
    .then(res => res.json())
    .then(res => {
      if (res.data === null) throw new Error("response is not okay!")
      console.log(res.data)

      changeResults(res.data)
      changeLoadingStatus(false)
    })
    .catch(err => console.log(err))
  }

  const handleCloseButton = () => {
    changeValue("")
    
    if (results.length !== 0) changeResults([])
  }

  const handleSearchButton = (event: any) => {
    let _animation = buttonRef.current?.animate(
      [{ transform: `scale3d(0.7, 0.7, 1)`}],
      {
        duration: 200,
        easing: 'linear',
      }
    )

    searchText()

    // change the loading state to true
    changeLoadingStatus(true)

  }

  const handleChange = (event: any) => {
    changeValue(event.target.value)

    // if results are not empty, empty them
    if (results.length !== 0) changeResults([])
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      searchText()

      // change the loadingstate to true
      changeLoadingStatus(true)
    }
  } 


  useEffect(() => {
    const ClickAwayHandler = (event: any) => {
      if (!event.composedPath().includes(searchBarRef.current)) {
        changeResults([])
        changeLoadingStatus(false)
      }
     }

     window.addEventListener('click', ClickAwayHandler, false)

    return () => {
      window.removeEventListener('click', ClickAwayHandler, false)
    }
  }, [])


  return (
    <div className={style.searchBarWrapper} ref={searchBarRef}>
      <div className={style.searchContainer}>
        <div className={style.searchWrapper}>
          <div className={style.inputWrapper}>
            <input
              type="text"
              value={value}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Search for manga..."
            />
            <button className={style.closeButton} onClick={handleCloseButton}>
              <CloseIcon/>
            </button>
          </div>
          <button className={style.searchButton} ref={buttonRef} onClick={handleSearchButton}>
            <SearchIcon/>
          </button>
        </div>
        <div className={style.searchResultWrapper}>
          {
            loading ?
            <CircularLoading width={50} height={50} strokeColor={"gray"} />
            : (
              results.length !== 0 ?
                <SearchResults results={results} />
              : null
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SearchBar
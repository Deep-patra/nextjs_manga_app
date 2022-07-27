/* eslint-disable react/display-name */
import Image from 'next/image'
import { FC, forwardRef } from 'react'
import style from './header.module.css'
import SearchBar from '../Search'
import MenuIcon from './MenuIcon'
import Link from 'next/link'

const HEADING = "ANIME-TIME"

interface headerProps {
  toggleMenu: Function,
  toggleSearch: Function,
  showButton: boolean,
}


const Header = forwardRef<HTMLButtonElement, headerProps>(({ toggleMenu, toggleSearch, showButton }, ref) => {

  const handleToggle = () => {
    toggleMenu()
  }

  const handleSearch = () => {
    toggleSearch()
  }


  return (
    <header className={style.header}>
      <Link href={"/dashboard"}>
        <div className={style.letterWrapper}>
          {HEADING.split("").map((letter: string, index: number) => 
            <span key={index} className={style.letter}>{letter}</span>
          )}
        </div>
      </Link>

      {
        showButton ?
        <>
          <div className={style.searchContainer}>
            <SearchBar />
          </div>

          <div className={style.buttonWrapper}>
            <button type="button" className={style.searchButton} onClick={handleSearch}>
              <Image src="/assets/search.png" alt="search icon" width="30px" height="30px" />
            </button>
            <button type="button" className={style.menuButton} ref={ref} onClick={handleToggle}>
              <MenuIcon/>
            </button>
          </div>
        </> : null
      }

    </header>
  )
})

export default Header
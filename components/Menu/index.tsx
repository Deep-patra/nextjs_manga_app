import { FC, useState } from 'react'
import { useTransition, animated } from 'react-spring'
import { MouseEventHandler } from 'react'
import Image from 'next/image'
import Filter from '../Filter'
import style from './menu.module.css'

interface MenuProps {
  pageStatus: any,
  toggleHomePage: MouseEventHandler,
  toggleRecent: MouseEventHandler,
  toggleFavourite: MouseEventHandler,
  changeURL: Function,
  fetchMangas: Function,
}


const Menu: FC<MenuProps> = ({ pageStatus, toggleHomePage, toggleRecent, toggleFavourite, changeURL, fetchMangas }) => {
  const [openFilter, toggleFilter] = useState<boolean>(false)
  const transition = useTransition(openFilter, {
    from: { maxHeight: 0 },
    enter: { maxHeight: 1000 },
    leave: { maxHeight: 0 },
  })

  const handleFilter = (event: any) => {
    toggleFilter(!openFilter)
  }

  return (
    <div className={style.menuWrapper}>

      <div className={`${style.menuItem} ${pageStatus.homepage ? style.active : ""}`}>
        <button onClick={toggleHomePage}>
          <Image src="/assets/home.png" alt="Home" width="20px" height="20px"/>
          <p>Home</p>
        </button>
      </div>

      <div className={`${style.menuItem} ${pageStatus.recent ? style.active : ""}`}>
        <button onClick={toggleRecent}>
          <Image src="/assets/clock.png" alt="Recents" width="20px" height="20px"/>
          <p>Recents</p>
        </button>
      </div>

      <div className={`${style.menuItem} ${pageStatus.favourite ? style.active : ""}`}>
        <button onClick={toggleFavourite}>
          <Image src="/assets/favourite.png" alt="Favourite" width="20px" height="20px"/>
          <p>Favourites</p>
        </button>
      </div>

      <div className={style.menuItem}>
        <div className={style.filterWrapper}>
          <div className={style.filterHeadingWrapper}>
            <button onClick={handleFilter}>
              <Image src="/assets/filter.png" alt="Filter" width="20px" height="20px"/>
              <p>Filter</p>
            </button>
          </div> 
          {transition((styles, openFilter) => (
            openFilter ? 
              <animated.div
                style={{
                  ...styles,
                  overflow: 'hidden',
                }}
              >
                <Filter fetchMangas={fetchMangas} />
              </animated.div> 
              : null
          ))}
        </div>
      </div>

    </div>
  )
}

export default Menu
/* eslint-disable react/display-name */
import { forwardRef } from 'react'
import style from './sidebar.module.css'

interface sideBarProps {
  children: JSX.Element,
}

const SideBar = forwardRef<HTMLDivElement, sideBarProps>(({ children }, ref) => {

  return (
    <div className={style.sideBarWrapper} ref={ref}>
      {children}
    </div>
  )
})

export default SideBar
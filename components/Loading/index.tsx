import { FC } from 'react'
import style from './loading.module.css'

const loading: FC<{}> = () => {
  return (
    <div className={style.loadingWrapper}>
      <span className={style.loadingCircle}></span>
      <span className={style.loadingCircle}></span>
      <span className={style.loadingCircle}></span>
      <span className={style.loadingCircle}></span>
      <span className={style.loadingCircle}></span>
    </div>
  )
}

export default loading
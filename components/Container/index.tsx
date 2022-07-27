import style from './container.module.css'

const Container = (props: any) => {
  return (
    <div className={style.containerWrapper}>
      {props.children}
    </div>
  )
}

export default Container
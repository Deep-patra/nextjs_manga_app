import { FC, useState, useRef, useEffect } from 'react'
import style from './floatingButton.module.css'

interface HiddenDialogProps {
  open: boolean,
  close: Function,
  HiddenComp: JSX.Element,
}

const HiddenDialog: FC<HiddenDialogProps> = ({ open, close, HiddenComp }) => {

  return (
    <>
      { open ?
        <>
          {HiddenComp}
        </>
        : null
      }
    </>
  )

}



interface FabProps {
  HiddenComp: JSX.Element,
  span: JSX.Element
}

const Fab: FC<FabProps> = ({ span, HiddenComp }) => {

  const [open, toggle] = useState<boolean>(false)
  const ContainerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    toggle(!open)
  }

  const closeElement = () => {
    toggle(false)
  }

  useEffect(() => {
    const clickAwayHandler = (event: any) => {
      if (!event.composedPath().includes(ContainerRef.current) &&
        !event.composedPath().includes(buttonRef.current)) {
        closeElement()
      }
    }

    document.addEventListener('click', clickAwayHandler, false)

    return () => {
      document.removeEventListener('click', clickAwayHandler, false)
    }
  }, [])

  return (
    <div className={style.floatingButtonWrapper}>

      <div className={style.hiddenCompWrapper} ref={ContainerRef}>
        <HiddenDialog open={open} close={closeElement} HiddenComp={HiddenComp} />
      </div>

      <div className={style.buttonWrapper} ref={buttonRef}>
        <button
          type="button"
          className={style.actionButton}
          onClick={handleClick}
        >
          {span}
        </button>
      </div>

    </div>
  )
}

export default Fab
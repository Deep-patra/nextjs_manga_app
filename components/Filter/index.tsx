import { FC, useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTransition, animated } from 'react-spring'
import {
    changeDemographic,
    changeExcludeTags,
    changeIncludeTags,
    changeRating,
    changeStatus,
    changeHomeList,
    } from '../../stores/dashboardStore/actions'
import style from './filter.module.css'

interface controlProps {
  text: string,
  list: Array<{ type: string, selected: boolean }>,
  dispatchFunc: Function
}


const Control: FC<controlProps> = ({ text, list, dispatchFunc }) => {
  const [open, toggle] = useState<boolean>(false)
  const IconRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch()

  const transition = useTransition(open, {
    from: { maxHeight: 0 },
    enter: { maxHeight: 500 },
    leave: { maxHeight: 0 },
  })
  
  const handleClick = (event: any) => {
    toggle(!open) //toggle the dropdown
  }

  const handleCheckboxChange = (event: any) => {
    const type = event.target.dataset.type

    const newList = list.map((item: any) => {
      if (item.type === type) return { ...item, selected: !item.selected }
      return item
    })

    console.log(newList)

    dispatch(dispatchFunc(newList))
  }

  useEffect(() => {
    function clickAwayHandler(event: any) {
      if (!event.composedPath().includes(containerRef.current)) toggle(false)
    }

    document.addEventListener('click', clickAwayHandler, false)

    return () => {
      document.removeEventListener('click', clickAwayHandler, false)
    }
  })

  return (
    <div className={style.controlWrapper} ref={containerRef}>
      <button type="button" onClick={handleClick}>
        <p>{text}</p>
      </button>
      {transition((styles, open) => (
        open ? 
        <animated.div className={style.checkBoxWrapper} style={styles}>
          { list.map((item: any, index: number) => (
  
            <span key={index}>
              <input
                type="checkbox"
                value={item.type}
                name={item.type}
                id={item.type}
                checked={item.selected}
                data-type={item.type}
                onChange={handleCheckboxChange}
              />
              <label
                htmlFor={item.type}
                className={item.selected ? style.active : ""}
              >
                  {item.type}
              </label>
            </span>
          ))}
        </animated.div> : null
      ))
      }
    </div>
  )
}

interface filterType {
  fetchMangas: Function,

}

const Filter: FC<filterType> = ({ fetchMangas }) => {

  const dispatch = useDispatch()
  
  const [status_list, rating_list, demographic_list, includedTagList, excludedTagList] = useSelector((state: any)=> {
    return [state.status, state.rating, state.demographic, state.includeTags, state.excludeTags]
  })

  const handleApply = () => {
    dispatch(changeHomeList([]))

    fetchMangas() // fetch the mangas
  }


  return (
    <div className={style.filterControlsWrapper}>
      <Control text={"Select Status"} list={status_list} dispatchFunc={changeStatus} />
      <Control text="Select Rating" list={rating_list} dispatchFunc={changeRating} />
      <Control text="Select demographic" list={demographic_list} dispatchFunc={changeDemographic} />
      <Control text="Include tag" list={includedTagList} dispatchFunc={changeIncludeTags}/>
      <Control text="Exclude tag" list={excludedTagList} dispatchFunc={changeExcludeTags} />
      <div className={style.applyButtonWrapper}>
        <button onClick={handleApply}>Apply</button>
      </div>
    </div>
  )
}

export default Filter
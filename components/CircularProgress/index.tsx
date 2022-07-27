import path from 'path'
import { FC, useRef, useEffect } from 'react'

interface CircularLoadingProps {
  width: number,
  height: number,
  strokeColor: string,
}

const CircularLoading: FC<CircularLoadingProps> = ({ width, height, strokeColor }) => {

  const pathRef = useRef(null)

  useEffect(() => {
    // animate the svg
    if (pathRef.current !== null) {

      const _rotateAnimation = (pathRef.current as SVGPathElement).animate(
        [
          { transform: `rotateZ(0deg)` },
          { transform: `rotateZ(360deg) `},
        ],
        {
          duration: 500,
          fill: 'forwards',
          easing: 'linear',
          iterations: Number.POSITIVE_INFINITY,
        }
      )

      const _pathAnimation = (pathRef.current as SVGPathElement).animate(
        [
          { strokeDashoffset: 50 },
          { strokeDashoffset: 230 },
          { strokeDashoffset: 50 },
        ],
        {
          duration: 2000,
          fill: 'forwards',
          easing: 'ease-in',
          iterations: Number.POSITIVE_INFINITY,
        }
      )
    }
  }, [])

  return (
    <div style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
    }}>
      <svg
        width={`${width}px`}
        height={`${height}px`}
        viewBox="0 0 100 100"
        version="1.1"
        id="svg5"
      >
        <defs
          id="defs2" />
        <g id="layer1">
          <path
            id="path31"
            ref={pathRef}
            style={{ stroke: `${strokeColor}`, fill: `transparent`, strokeWidth: '4px', transformOrigin: 'center', strokeDasharray: 230 }}
            d="M 74.26518,50.000005 A 24.265183,24.26518 0 0 1 50,74.265175 24.265183,24.26518 0 0 1 25.73482,50.000005 24.265183,24.26518 0 0 1 50,25.734825 24.265183,24.26518 0 0 1 74.26518,50.000005 Z"/>
        </g>
      </svg>
    </div>
  )
}

export default CircularLoading
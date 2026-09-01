import './variables.css'
import style from './skeleton.module.scss'

interface SkeletonProps {
  width?: number | string
  height?: number | string
  borderRadius?: number
  className?: string
}

const Skeleton = ({
                    width = '100%',
                    height = 20,
                    borderRadius = 4,
                    className
                  }: SkeletonProps) => {
  return (
    <div
      className={`${style.skeleton} ${className || ''}`}
      style={{ width, height, borderRadius }}
    >
      <div className={style.skeleton__shimmer}></div>
    </div>
  )
}

export default Skeleton

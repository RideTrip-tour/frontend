import style from './smallcategory.module.scss'
import './variables.css'

interface SmallCategoryProps {
  text: string
}

const SmallCategory = ({ text }: SmallCategoryProps) => {
  return (
    <div className={style.smallcategory}>
      <div className={style.smallcategory__text}>
        {text}
      </div>
    </div>
  )
}

export default SmallCategory
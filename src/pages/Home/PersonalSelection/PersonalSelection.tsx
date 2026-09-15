import style from './personalselection.module.scss'
import ToursFinder from '@/shared/ui/compose/ToursFinder'

function PersonalSelection() {
  return (
    <>
      <div className={style.personalselection}>
        <div className={style.personalselection__title}>
          <div className={style.personalselection__title_small}>
            Учитываем каждую мелочь
          </div>
        </div>
        <div className={style.personalselection__text}>
          Даже если заполните не всё - покажем самое лучшее.
        </div>
        <div className={style.personalselection__selects}>
          <ToursFinder/>
        </div>
      </div>
    </>
  )
}

export default PersonalSelection


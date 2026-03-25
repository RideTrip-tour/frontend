import style from './personalselection.module.scss'
import ToursFinder from '@/shared/ui/compose/ToursFinder'

function PersonalSelection() {
  return (
    <>
      <div className={style.personalselection}>
        <div className={style.personalselection__title}>
          <div className={style.personalselection__title_small}>
            Персональный подбор отдыха
          </div>
        </div>
        <div className={style.personalselection__text}>
          Персонализированные путешествия с учётом вашего уровня и интересов.
        </div>
        <div className={style.personalselection__selects}>
          <ToursFinder/>
        </div>
      </div>
    </>
  )
}

export default PersonalSelection


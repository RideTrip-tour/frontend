import style from './footer.module.scss'
import {Button} from '@/shared/ui/base/Button'
import {Icon} from '@iconify/react'

export function Footer() {
  return (
    <>
      <footer className={style.footer}>
        <div className={style.footer__content}>
          <img
            src={'/assets/images/pages/footer-lines.svg'}
            alt={'bg-img'}
            className={style.footer__content__bg}
          />
          <div className={style.footer__content__firstStep}>
            <div className={style.footer__content__firstStep__text}>
              Сделайте первый шаг к поездке
            </div>
            <div className={style.footer__content__firstStep__button}>
              <Button
                onClick={() => {
                  console.log('asd')
                }}
                text={'Найти подбор'}
                icon={'material-symbols:arrow-forward-rounded'}
              />
            </div>
          </div>

          <div className={style.footer__content__links}>
            <div className={style.footer__content__links__socials}>
              <div className={style.footer__content__links__socials__logo}>
                LOGO
              </div>
              <div className={style.footer__content__links__socials__images}>
                <div className={style.footer__content__links__socials__images_btn}>
                  <Icon
                    icon="ic:baseline-telegram"
                    className={style.footer__content__links__socials__images_btn_img}
                  />
                </div>
                <div className={style.footer__content__links__socials__images_btn}>
                  <Icon
                    icon="formkit:whatsapp"
                    className={style.footer__content__links__socials__images_btn_img}
                  />
                </div>
              </div>
            </div>
            <div className={style.footer__content__links__list}>
              <div className={style.footer__content__links__list__column}>
                <div className={style.footer__content__links__list__column__item}>
                  Главная
                </div>
                <div className={style.footer__content__links__list__column__item}>
                  Найти отдых
                </div>
                <div className={style.footer__content__links__list__column__item}>
                  Мои туры
                </div>
              </div>
              <div className={style.footer__content__links__list__column}>
                <div className={style.footer__content__links__list__column__item}>
                  Избранное
                </div>
                <div className={style.footer__content__links__list__column__item}>
                  Войти
                </div>
              </div>
            </div>
            <div className={style.footer__content__links_empty}>
            </div>
          </div>
          <div className={style.footer__content__text}>
            TRAVEL
          </div>
          <div className={style.footer__content__terms}>
            <div className={style.footer__content__terms__line}>

            </div>
            <div className={style.footer__content__terms__list}>
              <div className={style.footer__content__terms__list__item}>
                Политика конфиденциальности
              </div>
              <div className={style.footer__content__terms__list__item}>
                2026,  All right reserved
              </div>
              <div className={style.footer__content__terms__list__item}>
                Условия использования
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

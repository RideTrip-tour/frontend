import style from './footer.module.scss'
import {Icon} from '@iconify/react'

export function Footer() {
  return (
    <footer className={style.footer}>
      <div className={style.footer__inner}>

        <div className={style.footer__top}>
          <div className={style.footer__brand}>
            <div className={style.footer__logo}>Logo</div>
            <div className={style.footer__socials}>
              <a
                href="https://t.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={style.footer__socialLink}
                aria-label="Telegram"
              >
                <Icon icon="ic:baseline-telegram" />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className={style.footer__socialLink}
                aria-label="WhatsApp"
              >
                <Icon icon="formkit:whatsapp" />
              </a>
            </div>
          </div>

          <div className={style.footer__sections}>
            <div className={style.footer__section}>
              <div className={style.footer__sectionTitle}>НАВИГАЦИЯ</div>
              <a href="/" className={style.footer__sectionLink}>Главная</a>
              <a href="/constructor" className={style.footer__sectionLink}>Собрать поездку</a>
              <a href="/my-tours" className={style.footer__sectionLink}>Мои туры</a>
              <a href="/favorites" className={style.footer__sectionLink}>Избранные</a>
            </div>

            <div className={style.footer__section}>
              <div className={style.footer__sectionTitle}>Как это работает</div>
              <a href="/how-to-build" className={style.footer__sectionLink}>Как собрать поездку?</a>
              <a href="/what-to-take" className={style.footer__sectionLink}>Что взять с собой?</a>
              <a href="/quick-search" className={style.footer__sectionLink}>Быстрый подбор</a>
              <a href="/advanced-search" className={style.footer__sectionLink}>Расширенный поиск</a>
            </div>

            <div className={style.footer__section}>
              <div className={style.footer__sectionTitle}>О сервисе</div>
              <a href="/about" className={style.footer__sectionLink}>О нас</a>
              <a href="/reviews" className={style.footer__sectionLink}>Отзывы</a>
            </div>
          </div>
        </div>

        <div className={style.footer__support}>
          <span className={style.footer__supportLabel}>
            Нужна помощь? Напишите нам
          </span>
          <a
            href="mailto:support.travel@mail.ru"
            className={style.footer__supportEmail}
          >
            support.travel@mail.ru
          </a>
        </div>

        <div className={style.footer__travel} aria-hidden="true">
          <span className={style.footer__travelBack}>travel</span>
          <span className={style.footer__travelFront}>travel</span>
        </div>

        <div className={style.footer__divider} />

        <div className={style.footer__bottom}>
          <a href="/privacy" className={style.footer__bottomItem}>
            Политика конфиденциальности
          </a>
          <span className={style.footer__bottomItem}>
            2026 &ldquo;Тришагадо&rdquo;. Все права защищены.
          </span>
          <a href="/terms" className={style.footer__bottomItem}>
            Условия использования
          </a>
        </div>

      </div>
    </footer>
  )
}
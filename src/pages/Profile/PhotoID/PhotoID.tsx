import style from './photoid.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import ProfilePhoto from '@/shared/ui/base/ProfilePhoto'
import Tooltip from '@/shared/ui/base/Tooltip'
import {Icon} from '@iconify/react'
import {useNavigate} from 'react-router-dom'
import './variables.css'

function PhotoID() {
  const navigate = useNavigate()

  const userId = '78565987'
  const userName = ''

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userId)
    console.log('copied:', userId)
  }

  return (
    <PageSection paddingVertical={16}
                 paddingHorizontal={20}
    >
      <div className={style.photoid}>

        <div className={style.photoid__wrapper}>

          <ProfilePhoto
            size={160}
            onUpload={async (file) => {
              console.log('upload:', file)
            }}
          />

          <div className={style.photoid__info}>
            {userName &&
              <div className={style.photoid__info__name}>
                {userName}
              </div>
            }
            <div className={style.photoid__info__id}>
              <div className={style.photoid__info__id_text}>
                Участник {userId}
              </div>

              <Tooltip text="Скопировать"
                       position="top"
              >
                <button
                  className={style.photoid__info__copy}
                  onClick={handleCopy}
                  aria-label="copy id"
                >
                  <Icon icon="solar:copy-line-duotone"
                        width={20}
                        height={20}
                  />
                </button>
              </Tooltip>
            </div>

            <div className={style.photoid__info__status}>
              Профиль не заполнен
            </div>
          </div>
        </div>
        <div className={style.photoid__settings}>
          <button
            className={style.photoid__settings__btn}
            onClick={() => navigate('/profile/settings')}
            type="button"
          >
              <span className={style.photoid__settings__text}>
                Настройки
              </span>

            <span className={style.photoid__settings__icon}>
                <Icon
                  icon="weui:setting-filled"
                  className={style.photoid__settings__svg}
                />
              </span>
          </button>
        </div>
      </div>
    </PageSection>
  )
}

export default PhotoID
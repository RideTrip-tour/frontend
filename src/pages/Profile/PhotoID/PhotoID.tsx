import style from './photoid.module.scss'
import ProfilePhoto from '@/shared/ui/base/ProfilePhoto/ProfilePhoto'
import Tooltip from '@/shared/ui/base/Tooltip'
import {Icon} from '@iconify/react'
import {useNavigate} from 'react-router-dom'
import {useCopyToClipboard} from '@/hooks'
import {useProfileStore} from '@/store'
import './variables.css'

function PhotoID() {
  const navigate = useNavigate()
  const { copied, copy } = useCopyToClipboard()
  const userId = useProfileStore(s => s.userId) || '78565987'

  return (
    <div className={style.photoid}>
      <div className={style.photoid__wrapper}>

        <div className={style.photoid__info}>
          <div className={style.photoid__avatar}>
            <ProfilePhoto
              size={160}
              onUpload={async (file) => {
                console.log('upload:', file)
              }}
            />
          </div>

          <div className={style.photoid__text}>
            <div className={style.photoid__id}>
              <div className={style.photoid__id_text}>
                Участник {userId}
              </div>

              <Tooltip
                text={copied ? 'Скопировано!' : 'Скопировать'}
                position="top"
                visible={copied || undefined}
              >
                <button
                  className={style.photoid__copy}
                  onClick={() => copy(userId)}
                  aria-label="copy id"
                >
                  <Icon icon="solar:copy-line-duotone" width={20} height={20} />
                </button>
              </Tooltip>
            </div>

            <div className={style.photoid__status}>
              Профиль пока не заполнен, чем больше данных — тем точнее подбор
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
    </div>
  )
}

export default PhotoID
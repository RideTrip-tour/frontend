import { useState } from 'react'
import style from './privacyblock.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import SectionHeader from '@/shared/ui/base/SectionHeader'
import Divider from '@/shared/ui/base/Divider'
import CheckOption from '@/shared/ui/compose/CheckOption'
import './variables.css'

const PROFILE_OPTIONS = [
  {
    key: 'publicProfile',
    title: 'Публичный профиль',
    description: 'Другие пользователи смогут видеть ваше имя и отзывы',
  },
  {
    key: 'showName',
    title: 'Показывать имя в отзывах',
    description: 'Ваше имя будет видно рядом с отзывами которые вы оставляете',
  },
]

const DATA_OPTIONS = [
  {
    key: 'activity',
    title: 'Учитывать мою активность',
    description: 'Просмотры и избранное помогают делать подборки точнее',
  },
  {
    key: 'recommendations',
    title: 'Персональные рекомендации на основе профиля',
    description: 'Используем ваши предпочтения из профиля для подбора',
  },
]

const GEO_OPTIONS = [
  {
    key: 'city',
    title: 'Использовать мой город для подбора туров',
    description: 'Автоматически подставляем ваш город отправления',
  },
]

function PrivacyBlock() {
  const [profileState, setProfileState] = useState<Record<string, boolean>>({})
  const [dataState, setDataState] = useState<Record<string, boolean>>({})
  const [geoState, setGeoState] = useState<Record<string, boolean>>({})

  const handleChange = (
    setter: (fn: (prev: Record<string, boolean>) => Record<string, boolean>) => void,
    key: string,
  ) => (value: boolean) => setter(prev => ({ ...prev, [key]: value }))

  return (
    <PageSection paddingVertical={32} paddingHorizontal={40}>
      <div className={style.privacyblock}>
        <SectionHeader
          title="Приватность"
          subtitle="Вы контролируете какие данные мы используем"
          variant="muted"
        />
        <Divider />
        <div className={style.privacyblock__group}>
          <div className={style.privacyblock__groupTitle}>
            Профиль
          </div>
          <div className={style.privacyblock__checks}>
            {PROFILE_OPTIONS.map(option => (
              <CheckOption
                key={option.key}
                checked={Boolean(profileState[option.key])}
                onChange={handleChange(setProfileState, option.key)}
                title={option.title}
                description={option.description}
              />
            ))}
          </div>
        </div>
        <Divider />
        <div className={style.privacyblock__group}>
          <div className={style.privacyblock__groupTitle}>
            Данные и рекомендации
          </div>
          <div className={`${style.privacyblock__checks} ${style['privacyblock__checks--medium']}`}>
            {DATA_OPTIONS.map(option => (
              <CheckOption
                key={option.key}
                checked={Boolean(dataState[option.key])}
                onChange={handleChange(setDataState, option.key)}
                title={option.title}
                description={option.description}
              />
            ))}
          </div>
        </div>
        <Divider />
        <div className={style.privacyblock__group}>
          <div className={style.privacyblock__groupTitle}>
            Геоданные
          </div>
          <div className={style.privacyblock__checks}>
            {GEO_OPTIONS.map(option => (
              <CheckOption
                key={option.key}
                checked={Boolean(geoState[option.key])}
                onChange={handleChange(setGeoState, option.key)}
                title={option.title}
                description={option.description}
              />
            ))}
          </div>
        </div>
      </div>
    </PageSection>
  )
}

export default PrivacyBlock
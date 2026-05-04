import style from './profilesteps.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import Input from '@/shared/ui/base/Input'
import Select from '@/shared/ui/base/Select'
import Checkbox from '@/shared/ui/base/Checkbox'
import { Button } from '@/shared/ui/base/Button'
import { Icon } from '@iconify/react'
import TextLink from '@/shared/ui/base/TextLink'
import { type CSSProperties, useState } from 'react'
import type { Option } from '@/shared/ui/base/Select/Select.tsx'
import SkillQuiz from '@/pages/Profile/ProfileSteps/SkillQuiz'
import ModalChildren from '@/shared/ui/base/ModalChildren'

const GENDER_OPTIONS: Option[] = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
]

const COUNTRY_OPTIONS: Option[] = [
  { value: 'ru', label: 'Россия' },
  { value: 'by', label: 'Беларусь' },
  { value: 'kz', label: 'Казахстан' },
]

const CITY_OPTIONS: Option[] = [
  { value: 'msk', label: 'Москва' },
  { value: 'spb', label: 'Санкт-Петербург' },
  { value: 'nsk', label: 'Новосибирск' },
  { value: 'ekb', label: 'Екатеринбург' },
]

const RIDING_STYLES = [
  'Трассовое катание',
  'Фрирайд',
  'Фристайл',
  'Гонки и экстрим',
  'Ски-туры/Сплитбординг',
]

const SKILL_LEVELS = [
  {
    title: 'Новичок',
    value: 'beginner',
    description: ['Никогда не катался / пробовал 1–2 раза', 'Нужны простые трассы и инструктор'],
  },
  {
    title: 'Средний',
    value: 'intermediate',
    description: ['Катаюсь уверенно', 'Хочу развивать технику и пробовать новые маршруты'],
  },
  {
    title: 'Продвинутый',
    value: 'advanced',
    description: ['Катаюсь регулярно', 'Ищу сложные маршруты и челленджи'],
  },
]

const REST_FORMATS = ['Спокойный', 'Активный', 'Экстремальный', 'Смешанный']
const COMPANY_TYPES = ['Один', 'Пара', 'С друзьями', 'С семьёй']
const TRIP_DURATIONS = ['Выходные', '3-5 дней', 'Неделя +']

const EMPTY_PERSONAL = {
  firstName: '',
  lastName: '',
  gender: '',
  country: '',
  city: '',
  otherCities: '',
}

const EMPTY_PREFERENCES = {
  ridingStyles: [] as string[],
  skillLevel: '',
}

const EMPTY_TRIP = {
  restFormats: [] as string[],
  companyTypes: [] as string[],
  tripDurations: [] as string[],
}

interface PersonalData {
  firstName: string
  lastName: string
  gender: string
  country: string
  city: string
  otherCities: string
}

interface PreferencesData {
  ridingStyles: string[]
  skillLevel: string
}

interface TripData {
  restFormats: string[]
  companyTypes: string[]
  tripDurations: string[]
}

interface StepHeaderProps {
  title: string
  onEdit: () => void
}

const StepHeader = ({ title, onEdit }: StepHeaderProps) => (
  <div className={style.profilesteps__content__step__settings__title}>
    <div className={style.profilesteps__content__step__settings__title_text}>
      {title}
    </div>
    <div
      className={style.profilesteps__content__step__settings__title__button}
      onClick={onEdit}
    >
      <div className={style.profilesteps__content__step__settings__title__button_text}>
        Редактировать
      </div>
      <Icon
        icon="solar:pen-bold"
        width="20"
        height="20"
        className={style.profilesteps__content__step__settings__title__button_icon}
      />
    </div>
  </div>
)

interface StepActionsProps {
  onCancel: () => void
  onSave: () => void
}

const StepActions = ({ onCancel, onSave }: StepActionsProps) => (
  <div className={style.profilesteps__content__step__settings__buttons}>
    <Button onClick={onCancel} text="Отменить" variant="primary" />
    <Button onClick={onSave} text="Сохранить" variant="secondary" />
  </div>
)

interface CheckboxListProps {
  items: string[]
  selected: string[]
  onToggle: (item: string) => void
}

const CheckboxList = ({ items, selected, onToggle }: CheckboxListProps) => (
  <div className={style.profilesteps__preferences__list}>
    {items.map(item => (
      <div key={item} className={style.profilesteps__preferences__item}>
        <Checkbox
          checked={selected.includes(item)}
          onChange={() => onToggle(item)}
        />
        <div className={style.profilesteps__preferences__item_text}>{item}</div>
      </div>
    ))}
  </div>
)

function ProfileSteps() {
  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [openSelect, setOpenSelect] = useState<string | null>(null)

  const [savedPersonal, setSavedPersonal] = useState<PersonalData>(EMPTY_PERSONAL)
  const [draftPersonal, setDraftPersonal] = useState<PersonalData>(EMPTY_PERSONAL)

  const [savedConsent, setSavedConsent] = useState(false)
  const [draftConsent, setDraftConsent] = useState(false)

  const [savedPreferences, setSavedPreferences] = useState<PreferencesData>(EMPTY_PREFERENCES)
  const [draftPreferences, setDraftPreferences] = useState<PreferencesData>(EMPTY_PREFERENCES)

  const [savedTrip, setSavedTrip] = useState<TripData>(EMPTY_TRIP)
  const [draftTrip, setDraftTrip] = useState<TripData>(EMPTY_TRIP)

  const [isQuizOpen, setIsQuizOpen] = useState(false)

  const handleEdit = (step: number) => {
    if (step === 1) {
      setDraftPersonal(savedPersonal)
      setDraftConsent(savedConsent)
    }
    if (step === 2) setDraftPreferences(savedPreferences)
    if (step === 3) setDraftTrip(savedTrip)
    setEditingStep(step)
    setOpenSelect(null)
  }

  const handleCancel = (step: number) => {
    if (step === 1) {
      setDraftPersonal(savedPersonal)
      setDraftConsent(savedConsent)
    }
    if (step === 2) setDraftPreferences(savedPreferences)
    if (step === 3) setDraftTrip(savedTrip)
    setEditingStep(null)
    setOpenSelect(null)
  }

  const handleSavePersonal = () => {
    setSavedPersonal(draftPersonal)
    setSavedConsent(draftConsent)
    setEditingStep(null)
    alert(`Данные сохранены:\n${JSON.stringify(draftPersonal, null, 2)}`)
  }

  const handleSavePreferences = () => {
    setSavedPreferences(draftPreferences)
    setEditingStep(null)
    alert(`Данные сохранены:\n${JSON.stringify(draftPreferences, null, 2)}`)
  }

  const handleSaveTrip = () => {
    setSavedTrip(draftTrip)
    setEditingStep(null)
    alert(`Данные сохранены:\n${JSON.stringify(draftTrip, null, 2)}`)
  }

  const makeSelectProps = (key: string, currentValue: string, onSelectChange: (value: string) => void) => ({
    value: currentValue,
    isOpen: openSelect === key,
    onToggle: () => setOpenSelect(prev => (prev === key ? null : key)),
    onChange: (selectedValue: string) => {
      onSelectChange(selectedValue)
      setOpenSelect(null)
    },
  })

  const toggleDraftRidingStyle = (item: string) => {
    setDraftPreferences(prev => ({
      ...prev,
      ridingStyles: prev.ridingStyles.includes(item)
        ? prev.ridingStyles.filter(style => style !== item)
        : [...prev.ridingStyles, item],
    }))
  }

  const toggleDraftList = (key: keyof TripData, item: string) => {
    setDraftTrip(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(item)
        ? (prev[key] as string[]).filter(existing => existing !== item)
        : [...(prev[key] as string[]), item],
    }))
  }

  const lockedStyle: CSSProperties = { pointerEvents: 'none' }
  const editableStyle: CSSProperties = { pointerEvents: 'auto' }

  return (
    <div className={style.profilesteps}>
      <div className={style.profilesteps__content}>

        <div className={style.profilesteps__content__step}>
          <div className={style.profilesteps__content__step_text}>
            Шаг 1 из 3 — Будем знакомы
          </div>
          <PageSection paddingVertical={32} paddingHorizontal={40} isEditing={editingStep === 1}>
            <div className={style.profilesteps__content__step__settings}>
              <StepHeader title="Персональные данные" onEdit={() => handleEdit(1)} />
              <div style={editingStep === 1 ? editableStyle : lockedStyle}>
                <div className={style.profilesteps__content__step__settings__manual}>
                  <Input
                    placeholder="Имя"
                    value={draftPersonal.firstName}
                    onChange={firstName => setDraftPersonal(prev => ({ ...prev, firstName }))}
                    onSubmit={firstName => setDraftPersonal(prev => ({ ...prev, firstName }))}
                  />
                  <Input
                    placeholder="Фамилия"
                    value={draftPersonal.lastName}
                    onChange={lastName => setDraftPersonal(prev => ({ ...prev, lastName }))}
                    onSubmit={lastName => setDraftPersonal(prev => ({ ...prev, lastName }))}
                  />
                  <Select
                    options={GENDER_OPTIONS}
                    placeholder="Пол"
                    icon="iconamoon:arrow-right-2"
                    variant="secondary"
                    {...makeSelectProps('gender', draftPersonal.gender, gender =>
                      setDraftPersonal(prev => ({ ...prev, gender }))
                    )}
                  />
                  <Select
                    options={COUNTRY_OPTIONS}
                    placeholder="Страна"
                    icon="iconamoon:arrow-right-2"
                    variant="secondary"
                    {...makeSelectProps('country', draftPersonal.country, country =>
                      setDraftPersonal(prev => ({ ...prev, country }))
                    )}
                  />
                  <Select
                    options={CITY_OPTIONS}
                    placeholder="Город"
                    icon="iconamoon:arrow-right-2"
                    variant="secondary"
                    {...makeSelectProps('city', draftPersonal.city, city =>
                      setDraftPersonal(prev => ({ ...prev, city }))
                    )}
                  />
                  <div className={style.profilesteps__content__step__settings__manual__hint}>
                    <Select
                      options={CITY_OPTIONS}
                      placeholder="Другие важные города"
                      icon="iconamoon:arrow-right-2"
                      variant="secondary"
                      {...makeSelectProps('otherCities', draftPersonal.otherCities, otherCities =>
                        setDraftPersonal(prev => ({ ...prev, otherCities }))
                      )}
                    />
                    <div className={style.profilesteps__content__step__settings__manual__hint_text}>
                      Например, место работы или город частого пребывания
                    </div>
                  </div>
                </div>
                <div className={style.profilesteps__content__step__settings__data}>
                  <div className={style.profilesteps__content__step__settings__data__success}>
                    <Checkbox
                      checked={draftConsent}
                      onChange={() => setDraftConsent(prev => !prev)}
                    />
                    <div className={style.profilesteps__content__step__settings__data__success__text}>
                      Я даю согласие на{' '}
                      <TextLink text="обработку персональных данных" to="/privacy" />
                    </div>
                  </div>
                </div>
              </div>
              {editingStep === 1 && (
                <StepActions onCancel={() => handleCancel(1)} onSave={handleSavePersonal} />
              )}
            </div>
          </PageSection>
        </div>

        <div className={style.profilesteps__content__step}>
          <div className={style.profilesteps__content__step_text}>
            Шаг 2 из 3 — Ваши предпочтения
          </div>
          <PageSection paddingVertical={32} paddingHorizontal={40} isEditing={editingStep === 2}>
            <div className={style.profilesteps__content__step__settings}>
              <StepHeader title="Ваш стиль катания" onEdit={() => handleEdit(2)} />
              <div style={editingStep === 2 ? editableStyle : lockedStyle}>
                <div className={style.profilesteps__preferences}>
                  <CheckboxList
                    items={RIDING_STYLES}
                    selected={draftPreferences.ridingStyles}
                    onToggle={toggleDraftRidingStyle}
                  />
                  <div className={style.profilesteps__preferences__cards}>
                    {SKILL_LEVELS.map((level, index) => (
                      <>
                        <div
                          key={level.value}
                          className={[
                            style.profilesteps__preferences__cards__card,
                            draftPreferences.skillLevel === level.value
                              ? style['profilesteps__preferences__cards__card--active']
                              : '',
                          ].filter(Boolean).join(' ')}
                          onClick={() =>
                            setDraftPreferences(prev => ({ ...prev, skillLevel: level.value }))
                          }
                        >
                          <div className={style.profilesteps__preferences__cards__card_title}>
                            {level.title}
                          </div>
                          <div className={style.profilesteps__preferences__cards__card_text}>
                            {level.description.map(line => (
                              <div key={line}>● {line}</div>
                            ))}
                          </div>
                        </div>
                        {index !== SKILL_LEVELS.length - 1 && (
                          <div className={style.profilesteps__preferences__divider} />
                        )}
                      </>
                    ))}
                  </div>
                </div>
              </div>
              <div className={style.profilesteps__preferences_hint}
                   onClick={() => setIsQuizOpen(true)}
              >
                Не уверены? Мы подскажем
              </div>
              {editingStep === 2 && (
                <StepActions onCancel={() => handleCancel(2)} onSave={handleSavePreferences} />
              )}
            </div>
          </PageSection>
        </div>

        <div className={style.profilesteps__content__step}>
          <div className={style.profilesteps__content__step_text}>
            Шаг 3 из 3 — План поездки
          </div>
          <PageSection paddingVertical={32} paddingHorizontal={40} isEditing={editingStep === 3}>
            <div className={style.profilesteps__content__step__settings}>
              <StepHeader title="Формат отдыха" onEdit={() => handleEdit(3)} />
              <div style={editingStep === 3 ? editableStyle : lockedStyle}>
                <CheckboxList
                  items={REST_FORMATS}
                  selected={draftTrip.restFormats}
                  onToggle={item => toggleDraftList('restFormats', item)}
                />
                <div className={style.profilesteps__content__step__settings__title}>
                  <div className={style.profilesteps__content__step__settings__title_text}>
                    Компания
                  </div>
                </div>
                <CheckboxList
                  items={COMPANY_TYPES}
                  selected={draftTrip.companyTypes}
                  onToggle={item => toggleDraftList('companyTypes', item)}
                />
                <div className={style.profilesteps__content__step__settings__title}>
                  <div className={style.profilesteps__content__step__settings__title_text}>
                    Длительность поездки
                  </div>
                </div>
                <CheckboxList
                  items={TRIP_DURATIONS}
                  selected={draftTrip.tripDurations}
                  onToggle={item => toggleDraftList('tripDurations', item)}
                />
              </div>
              {editingStep === 3 && (
                <StepActions onCancel={() => handleCancel(3)} onSave={handleSaveTrip} />
              )}
            </div>
          </PageSection>
        </div>
      </div>
      {isQuizOpen && (
        <ModalChildren onClose={() => setIsQuizOpen(false)}>
          <SkillQuiz onClose={() => setIsQuizOpen(false)} />
        </ModalChildren>
      )}
    </div>
  )
}

export default ProfileSteps
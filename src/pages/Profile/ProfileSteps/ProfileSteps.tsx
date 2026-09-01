import style from './profilesteps.module.scss'
import Input from '@/shared/ui/base/Input'
import Select from '@/shared/ui/base/Select'
import { Button } from '@/shared/ui/base/Button'
import TextLink from '@/shared/ui/base/TextLink'
import Checkbox from '@/shared/ui/base/Checkbox'
import ToggleText from '@/shared/ui/base/ToggleText/ToggleText'
import Divider from '@/shared/ui/base/Divider'
import PersonalBlock from '@/shared/ui/page/Profile/PersonalBlock'
import { Fragment, useEffect, useState } from 'react'
import type { Option } from '@/shared/ui/base/Select/Select.tsx'
import SkillQuiz from '@/pages/Profile/ProfileSteps/SkillQuiz'
import ModalChildren from '@/shared/ui/base/ModalChildren'
import { useProfileStore, type PersonalData as StorePersonalData } from '@/store'
import { updateMyProfileRequest } from '@/services/profileService'
import './variables.css'

const GENDER_OPTIONS: Option[] = [
  { value: 'male', label: 'Мужской' },
  { value: 'female', label: 'Женский' },
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
  'Ски-туры/ Сплитбординг',
]

const SKILL_LEVELS = [
  {
    title: 'Новичок',
    value: 'beginner',
    description: [
      [
        { text: 'Никогда', bold: true },
        { text: ' не катался / пробовал 1–2 раза' },
      ],
      [
        { text: 'Нужны ' },
        { text: 'простые', bold: true },
        { text: ' трассы и ' },
        { text: 'инструктор', bold: true },
      ],
    ],
  },
  {
    title: 'Средний',
    value: 'intermediate',
    description: [
      [
        { text: 'Катаюсь ' },
        { text: 'уверенно', bold: true },
      ],
      [
        { text: 'Хочу ' },
        { text: 'развивать технику', bold: true },
        { text: ' и пробовать новые маршруты' },
      ],
    ],
  },
  {
    title: 'Продвинутый',
    value: 'advanced',
    description: [
      [
        { text: 'Катаюсь ' },
        { text: 'регулярно', bold: true },
      ],
      [
        { text: 'Ищу ' },
        { text: 'сложные маршруты', bold: true },
        { text: ' и новые челленджи' },
      ],
    ],
  },
]

const REST_FORMATS = ['Спокойный', 'Активный', 'Экстремальный', 'Смешанный']
const COMPANY_TYPES = ['Один', 'Пара', 'С друзьями', 'С семьёй']
const TRIP_DURATIONS = ['Выходные', '3-5 дней', 'Неделя +']

interface PreferencesData {
  ridingStyles: string[]
  skillLevel: string
}

interface TripData {
  restFormats: string[]
  companyTypes: string[]
  tripDurations: string[]
}

type PersonalData = StorePersonalData

interface PillListProps {
  items: string[]
  selected: string[]
  onToggle: (item: string) => void
}

const PillList = ({ items, selected, onToggle }: PillListProps) => (
  <div className={style.profilesteps__pills}>
    {items.map(item => (
      <ToggleText
        key={item}
        name={item}
        defaultOn={selected.includes(item)}
        onEnable={() => onToggle(item)}
        onDisable={() => onToggle(item)}
      />
    ))}
  </div>
)

function ProfileSteps() {
  const savedPersonal = useProfileStore(s => s.personal)
  const savedConsent = useProfileStore(s => s.consent)
  const savedPreferences = useProfileStore(s => s.preferences)
  const savedTrip = useProfileStore(s => s.trip)
  const setPersonal = useProfileStore(s => s.setPersonal)
  const setConsent = useProfileStore(s => s.setConsent)
  const setUserName = useProfileStore(s => s.setUserName)
  const setPreferences = useProfileStore(s => s.setPreferences)
  const setTrip = useProfileStore(s => s.setTrip)

  const [editingStep, setEditingStep] = useState<number | null>(null)
  const [openSelect, setOpenSelect] = useState<string | null>(null)
  const [draftPersonal, setDraftPersonal] = useState<PersonalData>(savedPersonal)
  const [draftConsent, setDraftConsent] = useState(savedConsent)
  const [draftPreferences, setDraftPreferences] = useState<PreferencesData>(savedPreferences)
  const [draftTrip, setDraftTrip] = useState<TripData>(savedTrip)
  const [isQuizOpen, setIsQuizOpen] = useState(false)

  useEffect(() => {
    if (editingStep !== null) return
    setDraftPersonal(savedPersonal)
  }, [savedPersonal, editingStep])

  useEffect(() => {
    if (editingStep !== null) return
    setDraftPreferences(savedPreferences)
  }, [savedPreferences, editingStep])

  useEffect(() => {
    if (editingStep !== null) return
    setDraftTrip(savedTrip)
  }, [savedTrip, editingStep])

  const startEditing = (step: number) => {
    if (step === 1) {
      setDraftPersonal(savedPersonal)
      setDraftConsent(savedConsent)
    } else if (step === 2) {
      setDraftPreferences(savedPreferences)
    } else {
      setDraftTrip(savedTrip)
    }
    setEditingStep(step)
    setOpenSelect(null)
  }

  const savePersonal = async () => {
    if (!draftConsent) return
    setPersonal(draftPersonal)
    setConsent(draftConsent)
    setEditingStep(null)
    const fullName = [draftPersonal.firstName, draftPersonal.lastName]
      .filter(Boolean)
      .join(' ')
      .trim()
    setUserName(fullName)
    try {
      await updateMyProfileRequest({
        first_name: draftPersonal.firstName,
        last_name: draftPersonal.lastName,
        phone_number: '',
        age: typeof draftPersonal.age === 'number' ? draftPersonal.age : 0,
        about_me: draftPersonal.aboutMe,
        activities: draftPersonal.activities,
        country: draftPersonal.country,
        city: draftPersonal.city,
        citizenship: draftPersonal.citizenship,
        currency: draftPersonal.currency,
      })
    } catch (e) {
      console.error('Не удалось сохранить профиль', e)
    }
  }

  const savePreferences = () => {
    setPreferences(draftPreferences)
    setEditingStep(null)
  }

  const saveTrip = () => {
    setTrip(draftTrip)
    setEditingStep(null)
  }

  const makeSelectProps = (
    key: string,
    currentValue: string,
    onSelectChange: (value: string) => void,
  ) => ({
    value: currentValue,
    isOpen: openSelect === key,
    onToggle: () => setOpenSelect(prev => (prev === key ? null : key)),
    onChange: (selectedValue: string) => {
      onSelectChange(selectedValue)
      setOpenSelect(null)
    },
  })

  const toggleRidingStyle = (item: string) => {
    setDraftPreferences(prev => ({
      ...prev,
      ridingStyles: prev.ridingStyles.includes(item)
        ? prev.ridingStyles.filter(s => s !== item)
        : [...prev.ridingStyles, item],
    }))
  }

  const toggleTripList = (key: keyof TripData, item: string) => {
    setDraftTrip(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(item)
        ? (prev[key] as string[]).filter(s => s !== item)
        : [...(prev[key] as string[]), item],
    }))
  }

  const isEditing = (step: number) => editingStep === step
  const lockedClass = style.profilesteps__locked
  const editableClass = style.profilesteps__editable

  const step1Rows = (
    <>
      <div className={`${style.profilesteps__row} ${style['profilesteps__row--gap']} ${isEditing(1) ? editableClass : lockedClass}`}>
        <div className={style.profilesteps__field}>
          <Input
            label="Имя"
            value={draftPersonal.firstName}
            onChange={firstName => setDraftPersonal(prev => ({ ...prev, firstName }))}
            onSubmit={firstName => setDraftPersonal(prev => ({ ...prev, firstName }))}
            placeholder="Введите ваше имя"
          />
        </div>
        <div className={style.profilesteps__field}>
          <Select
            label="Пол"
            options={GENDER_OPTIONS}
            placeholder="Выберите"
            icon="iconamoon:arrow-right-2"
            variant="secondary"
            {...makeSelectProps('gender', draftPersonal.gender, gender =>
              setDraftPersonal(prev => ({ ...prev, gender })),
            )}
          />
        </div>
      </div>
      <div className={`${style.profilesteps__row} ${style['profilesteps__row--cities']} ${isEditing(1) ? editableClass : lockedClass}`}>
        <div className={style.profilesteps__field}>
          <Select
            label="Город отправления"
            options={CITY_OPTIONS}
            placeholder="Откуда чаще всего летите"
            icon="iconamoon:arrow-right-2"
            variant="secondary"
            {...makeSelectProps('city', draftPersonal.city, city =>
              setDraftPersonal(prev => ({ ...prev, city })),
            )}
          />
        </div>
        <div className={style.profilesteps__field}>
          <Select
            label="Дополнительные города"
            options={CITY_OPTIONS}
            placeholder="Если летите из разных мест"
            icon="iconamoon:arrow-right-2"
            variant="secondary"
            {...makeSelectProps('otherCities', draftPersonal.otherCities, otherCities =>
              setDraftPersonal(prev => ({ ...prev, otherCities })),
            )}
          />
        </div>
      </div>
    </>
  )

  const step1Bottom = (
    <>
      <div className={style.profilesteps__consent}>
        <Checkbox
          checked={draftConsent}
          disabled={!isEditing(1)}
          onChange={value => setDraftConsent(value)}
        />
        <div className={style.profilesteps__consent__text}>
          <span>Я согласен на&nbsp;</span>
          <TextLink text="обработку персональных данных." to="/privacy" />
          <span>&nbsp;Они не будут переданы третьим лицам.</span>
        </div>
      </div>
      <div className={style.profilesteps__saveRow}>
        <Button
          onClick={savePersonal}
          text="Сохранить"
          variant="secondary"
          disabled={!isEditing(1) || !draftConsent}
        />
      </div>
    </>
  )

  const step2Body = (
    <div className={isEditing(2) ? editableClass : lockedClass}>
      <div className={`${style.profilesteps__group} ${style['profilesteps__group--step2-block']}`}>
        <div className={style.profilesteps__groupTitle}>Вид активности</div>
        <PillList
          items={RIDING_STYLES}
          selected={draftPreferences.ridingStyles}
          onToggle={toggleRidingStyle}
        />
        <div className={style.profilesteps__hint}>
          Трассовое катание: подготовленные трассы, подъёмки, освещение. Классика для любителей порядка и предсказуемости.
        </div>
      </div>
      <div className={`${style.profilesteps__divider} ${style['profilesteps__divider--step2']}`}>
        <Divider />
      </div>
      <div className={`${style.profilesteps__group} ${style.profilesteps__levelsGroup}`}>
        <div className={style.profilesteps__groupTitle}>Ваш уровень</div>
        <div className={style.profilesteps__levels}>
          {SKILL_LEVELS.map(level => (
            <Fragment key={level.value}>
              <div
                className={[
                  style.profilesteps__levelCard,
                  draftPreferences.skillLevel === level.value
                    ? style['profilesteps__levelCard--active']
                    : '',
                ].filter(Boolean).join(' ')}
                onClick={() =>
                  setDraftPreferences(prev => ({ ...prev, skillLevel: level.value }))
                }
              >
                <div className={style.profilesteps__levelCard__title}>{level.title}</div>
                <div className={style.profilesteps__levelCard__text}>
                  {level.description.map((line, lineIdx) => (
                    <div key={lineIdx} className={style.profilesteps__levelCard__bullet}>
                      <span className={style.profilesteps__levelCard__dot} />
                      <span>
                        {line.map((part, partIdx) => (
                          <span
                            key={partIdx}
                            className={
                              part.bold
                                ? style['profilesteps__levelCard__part--bold']
                                : style.profilesteps__levelCard__part
                            }
                          >
                            {part.text}
                          </span>
                        ))}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )

  const step2Bottom = (
    <>
      <div
        className={style.profilesteps__quizlink}
        onClick={() => setIsQuizOpen(true)}
      >
        Не уверены? Мы подскажем
      </div>
      <div className={style.profilesteps__saveRow}>
        <Button
          onClick={savePreferences}
          text="Сохранить"
          variant="secondary"
          disabled={!isEditing(2)}
        />
      </div>
    </>
  )

  const step3Groups = (
    <>
      <div className={`${style.profilesteps__group} ${style['profilesteps__group--gap24']}`}>
        <div className={style.profilesteps__groupTitle}>Формат отдыха</div>
        <PillList
          items={REST_FORMATS}
          selected={draftTrip.restFormats}
          onToggle={item => toggleTripList('restFormats', item)}
        />
      </div>
      <div className={style.profilesteps__divider} />
      <div className={`${style.profilesteps__group} ${style['profilesteps__group--gap24']}`}>
        <div className={style.profilesteps__groupTitle}>Компания</div>
        <PillList
          items={COMPANY_TYPES}
          selected={draftTrip.companyTypes}
          onToggle={item => toggleTripList('companyTypes', item)}
        />
      </div>
      <div className={style.profilesteps__divider} />
      <div className={style.profilesteps__group}>
        <div className={style.profilesteps__groupTitle}>Длительность поездки</div>
        <PillList
          items={TRIP_DURATIONS}
          selected={draftTrip.tripDurations}
          onToggle={item => toggleTripList('tripDurations', item)}
        />
      </div>
    </>
  )

  const step3Bottom = (
    <div className={style.profilesteps__saveRow}>
      <Button
        onClick={saveTrip}
        text="Сохранить"
        variant="secondary"
        disabled={!isEditing(3)}
      />
    </div>
  )

  return (
    <div className={style.profilesteps}>
      <PersonalBlock
        title="Личные данные"
        subtitle="Используются для оформления и сохранения бронирования"
        onEdit={() => startEditing(1)}
      >
        {step1Rows}
        {step1Bottom}
      </PersonalBlock>

      <PersonalBlock
        title="Стиль катания"
        subtitle="Помогает подобрать трассы и инструктора под ваш уровень"
        onEdit={() => startEditing(2)}
      >
        {step2Body}
        {step2Bottom}
      </PersonalBlock>

      <PersonalBlock
        title="План поездки"
        subtitle="Помогает находить туры под ваш формат отдыха"
        onEdit={() => startEditing(3)}
      >
        <div className={isEditing(3) ? editableClass : lockedClass}>
          {step3Groups}
        </div>
        {step3Bottom}
      </PersonalBlock>

      {isQuizOpen && (
        <ModalChildren onClose={() => setIsQuizOpen(false)}>
          <SkillQuiz />
        </ModalChildren>
      )}
    </div>
  )
}

export default ProfileSteps
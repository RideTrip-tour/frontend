import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import style from './securityblock.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import SectionHeader from '@/shared/ui/base/SectionHeader'
import Divider from '@/shared/ui/base/Divider'
import InfoRow from '@/shared/ui/base/InfoRow'
import {
  ChangePasswordModal,
  ChangeEmailModal,
  EmailChangeSentModal
} from '@/components/auth'
import ChangePhoneModal from '@/shared/ui/compose/Modals/ChangePhoneModal'
import { changePasswordRequest, requestChangeEmailRequest } from '@/services/usersService'
import { updateMyProfileRequest } from '@/services/profileService'
import { useProfileStore } from '@/store'
import './variables.css'

function SecurityBlock() {
  const email = useProfileStore(s => s.userEmail)
  const phone = useProfileStore(s => s.userPhone)
  const setEmail = useProfileStore(s => s.setUserEmail)
  const setPhone = useProfileStore(s => s.setUserPhone)
  const [password] = useState('********')
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)
  const [phoneLoading, setPhoneLoading] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false)
  const [isEmailChangeSentModalOpen, setIsEmailChangeSentModalOpen] = useState(false)
  const [emailChangeLoading, setEmailChangeLoading] = useState(false)
  const [emailChangeError, setEmailChangeError] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [pendingEmailChange, setPendingEmailChange] = useState<{
    email: string
    password: string
  } | null>(null)

  const handleChangePhone = async (nextPhone: string) => {
    setPhoneError('')
    setPhoneLoading(true)
    try {
      await updateMyProfileRequest({
        first_name: '',
        last_name: '',
        phone_number: nextPhone,
        age: 0,
        about_me: '',
        activities: [],
        country: '',
        city: '',
        citizenship: '',
        currency: '',
      })
      setPhone(nextPhone)
      setIsPhoneModalOpen(false)
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : 'Ошибка сервера')
    } finally {
      setPhoneLoading(false)
    }
  }

  const handleChangePassword = async (data: { current_password: string; new_password: string }) => {
    setPasswordError('')
    setPasswordLoading(true)
    try {
      await changePasswordRequest(data)
      setIsPasswordModalOpen(false)
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Ошибка сервера')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleChangeEmail = async (data: { email: string; password: string }) => {
    setEmailChangeError('')
    setEmailChangeLoading(true)
    try {
      await requestChangeEmailRequest({
        current_email: email,
        new_email: data.email,
        password: data.password
      })
      setEmail(data.email)
      setIsEmailChangeModalOpen(false)
      setNewEmail(data.email)
      setPendingEmailChange({ email: data.email, password: data.password })
      setIsEmailChangeSentModalOpen(true)
    } catch (err) {
      setEmailChangeError(err instanceof Error ? err.message : 'Ошибка сервера')
    } finally {
      setEmailChangeLoading(false)
    }
  }

  const handleResendEmailChange = async () => {
    if (!pendingEmailChange) return
    setEmailChangeError('')
    setEmailChangeLoading(true)
    try {
      await requestChangeEmailRequest({
        current_email: email,
        new_email: pendingEmailChange.email,
        password: pendingEmailChange.password
      })
    } catch (err) {
      setEmailChangeError(err instanceof Error ? err.message : 'Ошибка сервера')
    } finally {
      setEmailChangeLoading(false)
    }
  }

  return (
    <PageSection paddingVertical={32} paddingHorizontal={40}>
      <div className={style.securityblock}>
        <SectionHeader
          title="Безопасность"
          subtitle="Управление доступом к аккаунту"
        />
        <Divider />
        <div className={style.securityblock__rows}>
          <div className={style.securityblock__row}>
            <InfoRow
              label="Email"
              value={email || 'Не указан'}
              actionText="Изменить"
              onAction={() => setIsEmailChangeModalOpen(true)}
            />
          </div>
          <Divider />
          <div className={style.securityblock__row}>
            <InfoRow
              label="Пароль"
              value={password}
              actionText="Изменить"
              onAction={() => setIsPasswordModalOpen(true)}
            />
          </div>
          <Divider />
          <div className={style.securityblock__row}>
            <InfoRow
              label="Номер телефона"
              value={phone || 'Не указан'}
              actionText={phone ? 'Изменить' : 'Добавить'}
              onAction={() => setIsPhoneModalOpen(true)}
            />
          </div>
          <Divider />
          <div className={style.securityblock__row}>
            <InfoRow
              label="Активные устройства"
              value="Посмотреть активные устройства"
              actionText="Смотреть"
            />
          </div>
        </div>
      </div>

      <ChangePhoneModal
        key={isPhoneModalOpen ? `open-${phone}` : 'closed'}
        isOpen={isPhoneModalOpen}
        currentPhone={phone}
        isLoading={phoneLoading}
        serverError={phoneError}
        onClose={() => {
          setPhoneError('')
          setPhoneLoading(false)
          setIsPhoneModalOpen(false)
        }}
        onSubmit={handleChangePhone}
      />

      <AnimatePresence>
        {isPasswordModalOpen && (
          <ChangePasswordModal
            isLoading={passwordLoading}
            serverError={passwordError}
            onClose={() => setIsPasswordModalOpen(false)}
            onSubmit={handleChangePassword}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmailChangeModalOpen && (
          <ChangeEmailModal
            isLoading={emailChangeLoading}
            serverError={emailChangeError}
            onClose={() => setIsEmailChangeModalOpen(false)}
            onSubmit={handleChangeEmail}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEmailChangeSentModalOpen && (
          <EmailChangeSentModal
            email={newEmail}
            isLoading={emailChangeLoading}
            serverError={emailChangeError}
            onClose={() => setIsEmailChangeSentModalOpen(false)}
            onResend={handleResendEmailChange}
          />
        )}
      </AnimatePresence>
    </PageSection>
  )
}

export default SecurityBlock

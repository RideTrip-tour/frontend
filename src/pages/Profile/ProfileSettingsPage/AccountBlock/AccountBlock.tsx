import { Icon } from '@iconify/react'
import style from './accountblock.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import SectionHeader from '@/shared/ui/base/SectionHeader'
import DeleteAccountModal from '@/shared/ui/compose/Modals/DeleteAccountModal'
import LogoutConfirmModal from '@/shared/ui/compose/Modals/LogoutConfirmModal'
import { logoutRequest } from '@/services/authService'
import { deleteMyProfileRequest } from '@/services/profileService'
import { useProfileStore } from '@/store'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './variables.css'

function AccountBlock() {
  const navigate = useNavigate()
  const reset = useProfileStore(s => s.reset)
  const userEmail = useProfileStore(s => s.userEmail)

  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogout = async () => {
    setError('')
    setIsLoading(true)
    try {
      await logoutRequest()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сервера')
      setIsLoading(false)
      return
    }
    reset()
    navigate('/login')
  }

  const handleDelete = async () => {
    setError('')
    setIsLoading(true)
    try {
      await deleteMyProfileRequest()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка сервера')
      setIsLoading(false)
      return
    }
    reset()
    navigate('/login')
  }

  return (
    <PageSection paddingVertical={32} paddingHorizontal={40}>
      <div className={style.accountblock}>
        <div className={style.accountblock__content}>
          <SectionHeader
            title="Аккаунт"
            subtitle="Управление вашим аккаунтом"
            variant="muted"
          />
          <div className={style.accountblock__actions}>
            <button
              type="button"
              className={style.accountblock__logoutBtn}
              onClick={() => {
                setError('')
                setIsLogoutOpen(true)
              }}
            >
              <Icon
                icon="uil:exit"
                className={style.accountblock__logoutIcon}
              />
              <span className={style.accountblock__logoutText}>
                Выйти из аккаунта
              </span>
            </button>
            <div className={style.accountblock__deleteInfo}>
              <span
                className={style.accountblock__deleteText}
                onClick={() => {
                  setError('')
                  setIsDeleteOpen(true)
                }}
                role="button"
                tabIndex={0}
              >
                Удалить аккаунт
              </span>
              <span className={style.accountblock__warning}>
                После удаления вся информация об учётной записи будет стёрта.
                Восстановить её будет невозможно.
              </span>
            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmModal
        isOpen={isLogoutOpen}
        isLoading={isLoading}
        serverError={error}
        onClose={() => {
          setError('')
          setIsLoading(false)
          setIsLogoutOpen(false)
        }}
        onConfirm={handleLogout}
      />

      <DeleteAccountModal
        isOpen={isDeleteOpen}
        expectedEmail={userEmail}
        isLoading={isLoading}
        serverError={error}
        onClose={() => {
          setError('')
          setIsLoading(false)
          setIsDeleteOpen(false)
        }}
        onConfirm={handleDelete}
      />
    </PageSection>
  )
}

export default AccountBlock

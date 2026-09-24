import style from './profilesettingspage.module.scss'
import PageContent from '@/shared/ui/page/PageContent'
import BackLink from '@/shared/ui/base/BackLink'
import SecurityBlock from './SecurityBlock'
import NotificationsBlock from './NotificationsBlock'
import PrivacyBlock from './PrivacyBlock'
import DocumentsBlock from './DocumentsBlock'
import AccountBlock from './AccountBlock'
import './variables.css'

function ProfileSettingsPage() {
  return (
    <div className={style.profilesettingspage}>
      <PageContent>
        <div className={style.profilesettingspage__header}>
          <BackLink text="К профилю" to="/profile" />
          <div className={style.profilesettingspage__title}>
            Настройки
          </div>
        </div>
        <div className={style.profilesettingspage__content}>
          <SecurityBlock />
          <NotificationsBlock />
          <PrivacyBlock />
          <DocumentsBlock />
          <AccountBlock />
        </div>
      </PageContent>
    </div>
  )
}

export default ProfileSettingsPage

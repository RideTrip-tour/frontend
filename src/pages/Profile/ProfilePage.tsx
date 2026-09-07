import style from './profilepage.module.scss'
import PhotoID from '@/pages/Profile/PhotoID'
import PageContent from '@/shared/ui/page/PageContent'
import ProfileProgress from '@/pages/Profile/ProfileProgress'
import ProfileInfo from '@/pages/Profile/ProfileInfo'
import ProfileSteps from '@/pages/Profile/ProfileSteps'

function ProfilePage() {
  return (
    <div className={style.profilepage}>
      <PageContent>
        <PhotoID />
        <ProfileProgress value={30} />
        <ProfileInfo />
        <ProfileSteps />
      </PageContent>
    </div>
  )
}

export default ProfilePage
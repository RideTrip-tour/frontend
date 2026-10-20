import PhotoID from '@/pages/Profile/PhotoID';
import ProfileInfo from '@/pages/Profile/ProfileInfo';
import ProfileProgress from '@/pages/Profile/ProfileProgress';
import ProfileSteps from '@/pages/Profile/ProfileSteps';
import PageContent from '@/shared/ui/page/PageContent';

import style from './profilepage.module.scss';

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
  );
}

export default ProfilePage;

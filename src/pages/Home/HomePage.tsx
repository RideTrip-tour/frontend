import Welcome from '@/pages/Home/Welcome'
import Choice from '@/pages/Home/Choice'
import Recommendations from '@/pages/Home/Recommendations'
import Planning from '@/pages/Home/Planning'
import PersonalSelection from '@/pages/Home/PersonalSelection'
import Clients from '@/pages/Home/Clients'

function HomePage() {
  return (
    <>
      <Welcome />
      <Choice />
      <Recommendations />
      <Planning />
      <PersonalSelection />
      <Clients />
    </>
  )
}

export default HomePage
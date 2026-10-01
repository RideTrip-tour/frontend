import Choice from '@/pages/Home/Choice';
import Clients from '@/pages/Home/Clients';
import PersonalSelection from '@/pages/Home/PersonalSelection';
import Planning from '@/pages/Home/Planning';
import Recommendations from '@/pages/Home/Recommendations';
import Welcome from '@/pages/Home/Welcome';

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
  );
}

export default HomePage;

import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router';

import { ArrowRightIcon } from '@/assets/icons/constructor';
import { SkillQuiz } from '@/features/ski-level-quiz';
import Modal from '@/shared/ui/base/Modal';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { Button } from '@/shared/ui/Button';
import { GuideHero } from '@/shared/ui/page/GuideHero';

import { guideSteps, type GuideStep } from './steps';
import { DirectionPreview, PreferencesPreview, ResultsPreview } from './ui/GuidePreviews';

import style from './HowToBuildPage.module.scss';

const pageTitle = 'Как собрать поездку?';

function Step({ step, children }: { step: GuideStep; children: ReactNode }) {
  return (
    <section
      className={style.step}
      aria-labelledby={step.id}
    >
      <div className={style.card}>
        <h2 id={step.id}>{step.title}</h2>
        <p className={style.subtitle}>{step.subtitle}</p>
        <p className={style.description}>{step.description}</p>
        <div className={style.benefits}>
          <p>Что вы получаете на этом шаге:</p>
          <ul>
            {step.benefits.map((benefit) => (
              <li key={benefit}>{benefit}</li>
            ))}
          </ul>
        </div>
        <div className={style.tip}>
          <span aria-hidden="true">i</span>
          <p>{step.tip}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function HowToBuildPage() {
  const navigate = useNavigate();
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const startTrip = () => {
    void navigate('/trip-builder');
    window.scrollTo(0, 0);
  };

  return (
    <div
      className={style.page}
      data-fluid-layout
    >
      <Breadcrumbs
        className={style.breadcrumbs}
        items={[{ label: 'Главная', to: '/' }, { label: pageTitle }]}
      />

      <GuideHero title={pageTitle}>
        Обычно планирование — это десятки вкладок, таблицы, сравнения и тихая паника.
        <br />
        Мы сделали так, чтобы всё занимало несколько минут. Без волшебства, просто три шага.
      </GuideHero>

      <div className={style.steps}>
        <Step step={guideSteps.direction}>
          <DirectionPreview />
        </Step>
        <Step step={guideSteps.preferences}>
          <div className={style.preferences}>
            <PreferencesPreview />
            <button
              className={style.quizLink}
              onClick={() => setIsQuizOpen(true)}
              type="button"
              aria-haspopup="dialog"
            >
              Не знаете свой уровень? Мы подскажем
            </button>
          </div>
        </Step>
        <Step step={guideSteps.results}>
          <ResultsPreview />
        </Step>
      </div>

      <section className={style.cta}>
        <h2>Всё. Три шага — и вы уже в пути</h2>
        <p>Попробуйте прямо сейчас — это занимает несколько минут.</p>
        <Button
          className={style.startButton}
          icon={<ArrowRightIcon aria-hidden="true" />}
          onClick={startTrip}
          text="Начать подбор"
          variant="secondary"
        />
      </section>

      <Modal
        ariaLabel="Подбор уровня катания"
        className={style.quizModal}
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
      >
        <SkillQuiz onViewOptions={startTrip} />
      </Modal>
    </div>
  );
}

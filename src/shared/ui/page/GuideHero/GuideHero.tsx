import type { ReactNode } from 'react';

import mountainsImage from '@/assets/images/SnowyMountains.png';

import style from './GuideHero.module.scss';

interface GuideHeroProps {
  title: string;
  children: ReactNode;
}

export function GuideHero({ title, children }: GuideHeroProps) {
  return (
    <header className={style.hero}>
      <div className={style.content}>
        <p className={style.eyebrow}>Гайд по сервису</p>
        <h1 className={style.title}>{title}</h1>
        <p className={style.description}>{children}</p>
      </div>
      <img
        className={style.image}
        src={mountainsImage}
        alt="Горный склон с канатной дорогой"
      />
    </header>
  );
}

import mountainsImage from '@/assets/images/SnowyMountains.png';

import style from './WhatToTakeHero.module.scss';

export function WhatToTakeHero() {
  return (
    <header className={style.hero}>
      <div className={style.content}>
        <p className={style.eyebrow}>Гайд по сервису</p>
        <h1 className={style.title}>Что взять с собой?</h1>
        <p className={style.description}>
          Мы собрали главное, чтобы не вспоминать об этом уже в аэропорту или на склоне.
          <br />
          Список можно отмечать прямо на сайте — прогресс сохранится в вашем профиле.
        </p>
      </div>
      <img
        className={style.image}
        src={mountainsImage}
        alt="Горный склон с канатной дорогой"
      />
    </header>
  );
}

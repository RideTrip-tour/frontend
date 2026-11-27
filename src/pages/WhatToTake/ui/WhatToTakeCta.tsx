import { useNavigate } from 'react-router';

import { ArrowRightIcon, DownloadIcon } from '@/assets/icons/constructor';
import { Button } from '@/shared/ui/Button';

import style from './WhatToTakeCta.module.scss';

export function WhatToTakeCta() {
  const navigate = useNavigate();

  return (
    <section className={style.root}>
      <h2>Сохраните список и собирайтесь без паники</h2>
      <p>Главное, взять паспорт, деньги, страховку и желание приключений.</p>
      <div className={style.actions}>
        <Button
          className={style.Button}
          text="Скачать PDF"
          icon={<DownloadIcon aria-hidden="true" />}
          variant="primary"
          iconVariant="plain"
          onClick={() => window.print()}
        />
        <Button
          className={style.Button}
          text="Начать подбор"
          icon={<ArrowRightIcon aria-hidden="true" />}
          variant="secondary"
          onClick={() => navigate('/trip-builder')}
        />
      </div>
    </section>
  );
}

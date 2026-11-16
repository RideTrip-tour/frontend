import { useNavigate } from 'react-router';

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
          text="Скачать PDF"
          icon="solar:download-minimalistic-bold"
          variant="primary"
          iconVariant="plain"
          onClick={() => window.print()}
        />
        <Button
          text="Начать подбор"
          icon="solar:arrow-right-linear"
          variant="secondary"
          onClick={() => navigate('/trip-builder')}
        />
      </div>
    </section>
  );
}

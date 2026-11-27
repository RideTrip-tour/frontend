import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { GuideHero } from '@/shared/ui/page/GuideHero';

import { checklistSections } from './data';
import { useChecklist } from './model/useChecklist';
import { ChecklistProgress } from './ui/ChecklistProgress';
import { ChecklistSection } from './ui/ChecklistSection';
import { WhatToTakeCta } from './ui/WhatToTakeCta';

import style from './WhatToTakePage.module.scss';

export default function WhatToTakePage() {
  const { checkedItems, checkedSet, totalItems, toggleItem, resetChecklist } = useChecklist();

  return (
    <section className={style.page}>
      <Breadcrumbs
        className={style.breadcrumbs}
        items={[{ label: 'Главная', to: '/' }, { label: 'Что взять с собой?' }]}
      />

      <GuideHero title="Что взять с собой?">
        Мы собрали главное, чтобы не вспоминать об этом уже в аэропорту или на склоне.
        <br />
        Список можно отмечать прямо на сайте — прогресс сохранится в вашем профиле.
      </GuideHero>
      <ChecklistProgress
        checkedCount={checkedItems.length}
        totalCount={totalItems}
        onReset={resetChecklist}
      />

      <div className={style.sections}>
        {checklistSections.map((section) => (
          <ChecklistSection
            key={section.id}
            section={section}
            checkedItems={checkedSet}
            onItemChange={toggleItem}
          />
        ))}
      </div>

      <WhatToTakeCta />
    </section>
  );
}

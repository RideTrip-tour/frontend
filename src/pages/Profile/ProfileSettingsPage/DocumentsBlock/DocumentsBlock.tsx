import { useNavigate } from 'react-router';

import { useCopyToClipboard } from '@/hooks';
import { getLegalDocumentPath, LEGAL_DOCUMENTS } from '@/shared/config';
import Divider from '@/shared/ui/base/Divider';
import MenuRow from '@/shared/ui/base/MenuRow';
import SectionHeader from '@/shared/ui/base/SectionHeader';
import Tooltip from '@/shared/ui/base/Tooltip';
import PageSection from '@/shared/ui/page/PageSection';

import style from './documentsblock.module.scss';

import './variables.css';

const SUPPORT_EMAIL = 'support.travel@mail.ru';

function DocumentsBlock() {
  const { copied, copy } = useCopyToClipboard();
  const navigate = useNavigate();

  const handleCopyEmail = () => {
    copy(SUPPORT_EMAIL);
  };

  return (
    <PageSection
      paddingVertical={32}
      paddingHorizontal={40}
    >
      <div className={style.documentsblock}>
        <SectionHeader
          title="Документы"
          subtitle="Юридическая информация о сервисе"
          variant="muted"
        />
        <Divider />
        <div className={style.documentsblock__list}>
          {LEGAL_DOCUMENTS.map(({ slug, title }) => (
            <div
              key={slug}
              className={style.documentsblock__item}
            >
              <MenuRow
                text={title}
                onClick={() => navigate(getLegalDocumentPath(slug))}
              />
              <Divider />
            </div>
          ))}
        </div>
        <div className={style.documentsblock__support}>
          <div className={style.documentsblock__supportText}>Нужна помощь? Напишите нам</div>
          <Tooltip
            text="Скопировано"
            position="top"
            visible={copied}
          >
            <button
              type="button"
              className={style.documentsblock__supportMail}
              onClick={handleCopyEmail}
            >
              {SUPPORT_EMAIL}
            </button>
          </Tooltip>
        </div>
      </div>
    </PageSection>
  );
}

export default DocumentsBlock;

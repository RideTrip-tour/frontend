import { useEffect } from 'react';
import { Navigate, useParams } from 'react-router';

import { isLegalDocumentSlug } from '@/shared/config';
import BackLink from '@/shared/ui/base/BackLink';

import { getLegalDocumentContent } from '../model/content';
import { LegalDocument } from './LegalDocument';

import style from './LegalDocument.module.scss';

function LegalDocumentPage() {
  const { slug } = useParams<{ slug: string }>();
  const isKnown = isLegalDocumentSlug(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!isKnown) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return (
    <main className={style.page}>
      <div className={style.back}>
        <BackLink
          text="К профилю/Настройки"
          to="/profile/settings"
        />
      </div>
      <LegalDocument content={getLegalDocumentContent(slug)} />
    </main>
  );
}

export default LegalDocumentPage;

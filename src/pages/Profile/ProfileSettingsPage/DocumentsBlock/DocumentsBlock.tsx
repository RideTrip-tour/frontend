import style from './documentsblock.module.scss'
import PageSection from '@/shared/ui/page/PageSection'
import SectionHeader from '@/shared/ui/base/SectionHeader'
import Divider from '@/shared/ui/base/Divider'
import MenuRow from '@/shared/ui/base/MenuRow'
import Tooltip from '@/shared/ui/base/Tooltip'
import { useCopyToClipboard } from '@/hooks'
import './variables.css'

const SUPPORT_EMAIL = 'support.travel@mail.ru'

const DOCUMENTS = [
  'Политика конфиденциальности',
  'Пользовательское соглашение',
  'Условия использования сервиса',
  'Оферта продажи туров',
  'Согласие на обработку персональных данных',
  'Политика обработки файлов cookie',
]

function DocumentsBlock() {
  const { copied, copy } = useCopyToClipboard()

  const handleCopyEmail = () => {
    copy(SUPPORT_EMAIL)
  }

  return (
    <PageSection paddingVertical={32} paddingHorizontal={40}>
      <div className={style.documentsblock}>
        <SectionHeader
          title="Документы"
          subtitle="Юридическая информация о сервисе"
          variant="muted"
        />
        <Divider />
        <div className={style.documentsblock__list}>
          {DOCUMENTS.map(doc => (
            <div key={doc} className={style.documentsblock__item}>
              <MenuRow text={doc} />
              <Divider />
            </div>
          ))}
        </div>
        <div className={style.documentsblock__support}>
          <div className={style.documentsblock__supportText}>
            Нужна помощь? Напишите нам
          </div>
          <Tooltip text="Скопировано" position="top" visible={copied}>
            <div
              className={style.documentsblock__supportMail}
              onClick={handleCopyEmail}
            >
              {SUPPORT_EMAIL}
            </div>
          </Tooltip>
        </div>
      </div>
    </PageSection>
  )
}

export default DocumentsBlock
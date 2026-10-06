import type { CartMessageType } from '../model/cartModalTypes';

interface CartMessageContent {
  title: string;
  description: string;
}

export const cartModalContent: Record<CartMessageType, CartMessageContent> = {
  'save-success': {
    title: 'Сохранено!',
    description: 'Поездка будет ждать в «Избранных»',
  },
  'save-empty': {
    title: 'Ошибка сохранения',
    description: 'Заполните параметры поездки',
  },
  'save-error': {
    title: 'Ошибка сохранения',
    description: 'Проверьте соединение и попробуйте снова',
  },
  'pdf-empty': {
    title: 'Недостаточно данных для создания PDF',
    description: 'Заполните хотя бы пару параметров для формирования документа.',
  },
  'pdf-service-error': {
    title: 'Сервис генерации PDF временно недоступен',
    description: 'Попробуйте немного позже.',
  },
};

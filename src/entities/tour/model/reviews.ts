import dmitryPhoto from '../assets/reviews/dmitry.jpg';
import olgaPhoto from '../assets/reviews/olga.jpg';
import pavelPhoto from '../assets/reviews/pavel.jpg';

export interface TourReview {
  id: string;
  name: string;
  photo: string;
  category: string;
  rating: number;
  date: string;
  text: string;
}

export const ROSA_KHUTOR_REVIEWS: readonly TourReview[] = [
  {
    id: 'olga-2026-02-20',
    name: 'Ольга',
    photo: olgaPhoto,
    category: 'Средний',
    rating: 5,
    date: '20.02.2026',
    text: 'Мы искали активную поездку с трекингом и комфортным уровнем сервиса. Сайт предложил несколько вариантов с разной сложностью и бюджетом, и нам удалось найти идеальный баланс «нагрузка + комфорт».',
  },
  {
    id: 'pavel-2026-02-01',
    name: 'Павел',
    photo: pavelPhoto,
    category: 'Новичок',
    rating: 5,
    date: '01.02.2026',
    text: 'Я никогда раньше не катался, но по моим параметрам удалось выбрать тот самый тур, где я смог и отдохнуть, и насладиться первым опытом катания. Очень удобно, что всё выбрал в одном месте.',
  },
  {
    id: 'dmitry-2026-01-23',
    name: 'Дмитрий',
    photo: dmitryPhoto,
    category: 'Продвинутый',
    rating: 5,
    date: '23.01.2026',
    text: 'Обычно я сам всё планирую, но решил попробовать подбор. Понравилось, что варианты действительно учитывают уровень подготовки, а не просто «популярные направления». Могу советовать друзьям, но без семьи.',
  },
];

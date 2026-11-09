import style from './badge.module.scss';

interface BadgeProps {
  text: string;
}

export const Badge = ({ text }: BadgeProps) => {
  return (
    <div className={style.badge}>
      <span className={style.badge__text}>{text}</span>
    </div>
  );
};

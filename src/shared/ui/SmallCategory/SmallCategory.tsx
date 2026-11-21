import style from './smallcategory.module.scss';

interface SmallCategoryProps {
  text: string;
}

export const SmallCategory = ({ text }: SmallCategoryProps) => {
  return (
    <div className={style.smallcategory}>
      <div className={style.smallcategory__text}>{text}</div>
    </div>
  );
};

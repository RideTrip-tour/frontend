import style from './skillslevel.module.scss';

interface SkillsLevelProps {
  level: 0 | 1 | 2 | 3;
}

export const SkillsLevel = ({ level }: SkillsLevelProps) => {
  if (level === 0) {
    return (
      <div className={style.skillslevel}>
        <div className={style.skillslevel__label}>Уровень: подходит всем</div>
      </div>
    );
  }

  const circles = [1, 2, 3];

  const getLevelColorClass = (level: number) => {
    if (level === 1) {
      return style['skillslevel--green'];
    }

    if (level === 2) {
      return style['skillslevel--orange'];
    }

    return style['skillslevel--red'];
  };

  const colorClass = getLevelColorClass(level);

  return (
    <div className={`${style.skillslevel} ${colorClass}`}>
      <div className={style.skillslevel__label}>Уровень:</div>

      <div className={style.skillslevel__circles}>
        {circles.map((c) => (
          <div
            key={c}
            className={`${style.skillslevel__circle} ${
              c <= level
                ? style['skillslevel__circle--active']
                : style['skillslevel__circle--inactive']
            }`}
          />
        ))}
      </div>
    </div>
  );
};

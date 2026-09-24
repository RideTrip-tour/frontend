import style from './skillslevel.module.scss'
import './variables.css'

interface SkillsLevelProps {
  level: 0 | 1 | 2 | 3
}

const SkillsLevel = ({ level }: SkillsLevelProps) => {

  if (level === 0) {
    return (
      <div className={style.skillslevel}>
        <div className={style.skillslevel__label}>
          Уровень: подходит всем
        </div>
      </div>
    )
  }

  const circles = [1, 2, 3]

  const colorClass =
    level === 1
      ? style['skillslevel--green']
      : level === 2
        ? style['skillslevel--orange']
        : style['skillslevel--red']

  return (
    <div className={`${style.skillslevel} ${colorClass}`}>

      <div className={style.skillslevel__label}>
        Уровень:
      </div>

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
  )
}

export default SkillsLevel
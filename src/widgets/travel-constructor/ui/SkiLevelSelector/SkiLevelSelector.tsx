import type { SkiLevel } from '@/widgets/travel-constructor/model/types';
import {
  SKI_LEVELS,
  SKI_LEVEL_HINTS,
} from '@/widgets/travel-constructor/config/skiLevels';
import styles from './SkiLevelSelector.module.scss';

interface SkiLevelSelectorProps {
  value: SkiLevel | null;
  onChange: (level: SkiLevel) => void;
}

export function SkiLevelSelector({
  value,
  onChange,
}: SkiLevelSelectorProps) {
  return (
    <div className={styles.selector}>
      <fieldset className={styles.levels}>
        <legend>Выберите Ваш уровень</legend>

        {SKI_LEVELS.map((level) => (
          <label className={styles.levelOption} key={level}>
            <input
              checked={value === level}
              name="ski-level"
              onChange={() => onChange(level)}
              type="radio"
              value={level}
            />
            <span>{level}</span>
          </label>
        ))}
      </fieldset>

      <div className={styles.helpsec}>
        <div className={styles.hint} id="ski-level-hint" role="tooltip">
          {SKI_LEVELS.map((levelOption) => (
            <section className={styles.hintSection} key={levelOption}>
              <h4>{SKI_LEVEL_HINTS[levelOption].heading}</h4>
              <ul>
                {SKI_LEVEL_HINTS[levelOption].bullets.map((line, lineIndex) => (
                  <li key={`${levelOption}-${lineIndex}`}>
                    {line.map((part) => (
                      part.emphasis
                        ? <strong key={part.text}>{part.text}</strong>
                        : part.text
                    ))}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <button
          aria-describedby="ski-level-hint"
          className={styles.hintButton}
          type="button"
          onClick={() => window.alert('В разработке')}
        >
          Не уверены? Мы подскажем
        </button>
      </div>
    </div>
  );
}

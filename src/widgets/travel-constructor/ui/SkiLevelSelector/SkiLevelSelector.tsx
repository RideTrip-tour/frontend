import { SKI_LEVEL_HINTS } from '@/widgets/travel-constructor/config/skiLevels';

import styles from './SkiLevelSelector.module.scss';

const SKI_LEVEL_OPTIONS = ['Новичок', 'Средний', 'Продвинутый'];

function normalizeLevelName(name: string) {
  return name.trim().toLocaleLowerCase('ru-RU');
}

interface SkiLevelSelectorProps {
  value: string | null;
  onChange: (level: string) => void;
  levels: string[];
  isLoading?: boolean;
}

export function SkiLevelSelector({
  value,
  onChange,
  levels,
  isLoading = false,
}: Readonly<SkiLevelSelectorProps>) {
  const availableLevels = new Set(levels.map(normalizeLevelName));
  const selectableLevels = SKI_LEVEL_OPTIONS.filter(
    (level) => level === 'Средний' || availableLevels.has(normalizeLevelName(level)),
  );
  const selectedLevel = value === null ? null : normalizeLevelName(value);

  return (
    <div className={styles.selector}>
      <fieldset className={styles.levels}>
        <legend>Выберите Ваш уровень</legend>

        {isLoading ? (
          <p>Загрузка уровней...</p>
        ) : (
          selectableLevels.map((level) => (
            <label
              className={styles.levelOption}
              key={level}
            >
              <input
                checked={selectedLevel === normalizeLevelName(level)}
                name="ski-level"
                onChange={() => onChange(level)}
                type="radio"
                value={level}
              />
              <span>{level}</span>
            </label>
          ))
        )}
      </fieldset>

      <div className={styles.helpsec}>
        <div
          className={styles.hint}
          id="ski-level-hint"
          role="tooltip"
        >
          {selectableLevels.map((levelOption) => (
            <section
              className={styles.hintSection}
              key={levelOption}
            >
              <h4>{SKI_LEVEL_HINTS[levelOption]?.heading ?? levelOption}</h4>
              <ul>
                {(SKI_LEVEL_HINTS[levelOption]?.bullets ?? []).map((line, lineIndex) => (
                  <li key={`${levelOption}-${lineIndex}`}>
                    {line.map((part) =>
                      part.emphasis ? <strong key={part.text}>{part.text}</strong> : part.text,
                    )}
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

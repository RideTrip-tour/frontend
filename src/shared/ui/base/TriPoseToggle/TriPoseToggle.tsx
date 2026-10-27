import { useState } from 'react';

import style from './triposetoggle.module.scss';


type TriState = 'default' | 'included' | 'excluded';

interface TriPoseToggleProps {
  text: string;
  includedIcon: string;
  excludedIcon: string;
  onDefault?: () => void;
  onIncluded?: () => void;
  onExcluded?: () => void;
}

const TriPoseToggle = ({
  text,
  includedIcon,
  excludedIcon,
  onDefault,
  onIncluded,
  onExcluded,
}: TriPoseToggleProps) => {
  const [state, setState] = useState<TriState>('default');

  const handleClick = () => {
    let nextState: TriState;
    if (state === 'default') {
      nextState = 'included';
    } else if (state === 'included') {
      nextState = 'excluded';
    } else {
      nextState = 'default';
    }

    setState(nextState);

    if (nextState === 'default') onDefault?.();
    else if (nextState === 'included') onIncluded?.();
    else onExcluded?.();
  };

  let iconSrc: string | null;
  if (state === 'included') {
    iconSrc = includedIcon;
  } else if (state === 'excluded') {
    iconSrc = excludedIcon;
  } else {
    iconSrc = null;
  }
  const stateModifier = style[`triposetoggle--${state}`];
  const stateClass = `${style.triposetoggle} ${stateModifier}`;

  return (
    <button
      type="button"
      className={stateClass}
      onClick={handleClick}
      aria-pressed={state !== 'default'}
    >
      <div className={style.triposetoggle__content}>
        <div className={style.triposetoggle__text}>{text}</div>

        {iconSrc && (
          <img
            src={iconSrc}
            className={style.triposetoggle__icon}
            alt=""
          />
        )}
      </div>
    </button>
  );
};

export default TriPoseToggle;


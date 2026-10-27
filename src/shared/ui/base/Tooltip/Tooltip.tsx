import { type ReactNode, useState } from 'react';

import style from './tooltip.module.scss';


interface TooltipProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  visible?: boolean;
  children: ReactNode;
}

const Tooltip = ({ text, position = 'top', visible, children }: TooltipProps) => {
  const [hoverVisible, setHoverVisible] = useState(false);

  const isVisible = visible === true || (visible === undefined && hoverVisible);
  const positionClass = style[`tooltip__content--${position}`];
  const contentClass = `${style.tooltip__content} ${positionClass}`;

  return (
    <div
      className={style.tooltip}
      onMouseEnter={() => setHoverVisible(true)}
      onMouseLeave={() => setHoverVisible(false)}
    >
      {children}

      {isVisible && (
        <div className={contentClass}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;


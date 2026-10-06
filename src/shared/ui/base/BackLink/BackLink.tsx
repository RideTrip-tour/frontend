import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';

import style from './backlink.module.scss';

import './variables.css';

interface BackLinkProps {
  text: string;
  to: string;
}

const BackLink = ({ text, to }: BackLinkProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={style.backlink}
      onClick={() => navigate(to)}
    >
      <Icon
        icon="iconamoon:arrow-left-2"
        className={style.backlink__icon}
      />
      <div className={style.backlink__text}>{text}</div>
    </button>
  );
};

export default BackLink;

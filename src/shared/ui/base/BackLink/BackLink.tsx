import { useNavigate } from 'react-router';

import { ChevronRightIcon } from '@/assets/icons';

import style from './backlink.module.scss';

import './variables.css';

interface BackLinkBaseProps {
  text: string;
  className?: string;
}

export type BackLinkProps = BackLinkBaseProps &
  ({ to: string; onClick?: never } | { to?: never; onClick: () => void });

function BackLinkButton({ text, onClick, className }: BackLinkBaseProps & { onClick: () => void }) {
  return (
    <button
      type="button"
      className={[style.backlink, className].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      <ChevronRightIcon
        aria-hidden="true"
        className={style.backlink__icon}
      />
      <span className={style.backlink__text}>{text}</span>
    </button>
  );
}

function NavigatingBackLink({ text, to, className }: BackLinkBaseProps & { to: string }) {
  const navigate = useNavigate();

  return (
    <BackLinkButton
      text={text}
      className={className}
      onClick={() => navigate(to)}
    />
  );
}

const BackLink = (props: BackLinkProps) => {
  if (props.onClick !== undefined) {
    return (
      <BackLinkButton
        text={props.text}
        className={props.className}
        onClick={props.onClick}
      />
    );
  }

  return (
    <NavigatingBackLink
      text={props.text}
      className={props.className}
      to={props.to}
    />
  );
};

export default BackLink;

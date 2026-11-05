import { PortfolioIcon, TelegramIcon } from '@/assets/icons/about';
import { LinkButton } from '@/shared/ui/LinkButton';

import type { MemberCardData } from '../../model/types';

import style from './MemberCard.module.scss';

export function MemberCard({
  firstName,
  lastName,
  role,
  bio,
  skills,
  avatarUrl,
  contactAction,
  portfolioAction,
}: MemberCardData) {
  const fullName = `${firstName} ${lastName}`;

  return (
    <article className={style.root}>
      <div className={style.top}>
        {avatarUrl ? (
          <img
            className={style.avatar}
            src={avatarUrl}
            alt={fullName}
          />
        ) : (
          <svg
            className={style.avatar}
            viewBox="0 0 100 100"
            role="img"
            aria-label={fullName}
          >
            <rect
              width="100"
              height="100"
              fill="#e1e1e1"
            />
            <circle
              cx="50"
              cy="38"
              r="20"
              fill="#fff"
            />
            <ellipse
              cx="50"
              cy="100"
              rx="32"
              ry="30"
              fill="#fff"
            />
          </svg>
        )}
        <div className={style.header}>
          <h2 className={style.firstName}>{firstName}</h2>
          <p className={style.lastName}>{lastName}</p>
          <p className={style.role}>{role}</p>
        </div>
      </div>
      <div className={style.bio}>
        <p className={style.bioText}>{bio.join('\n\n')}</p>
      </div>
      <div className={style.bottom}>
        <ul className={style.skills}>
          {skills.map((skill) => (
            <li
              key={skill}
              className={style.skill}
            >
              {skill}
            </li>
          ))}
        </ul>
        <hr className={style.divider} />
        <div className={style.actions}>
          <LinkButton
            className={style.action}
            href={contactAction.href}
            icon={<TelegramIcon />}
          >
            {contactAction.label}
          </LinkButton>
          <LinkButton
            className={style.action}
            href={portfolioAction.href}
            icon={<PortfolioIcon />}
          >
            {portfolioAction.label}
          </LinkButton>
        </div>
      </div>
    </article>
  );
}

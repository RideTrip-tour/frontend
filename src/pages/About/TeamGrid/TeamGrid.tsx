import { MemberCard } from '@/entities/team-member';
import type { MemberCardData } from '@/entities/team-member';

import style from './TeamGrid.module.scss';

interface TeamGridProps {
  members: (MemberCardData & { id: string })[];
}

export function TeamGrid({ members }: TeamGridProps) {
  return (
    <ul className={style.root}>
      {members.map(({ id, ...member }) => (
        <li
          key={id}
          className={style.item}
        >
          <MemberCard {...member} />
        </li>
      ))}
    </ul>
  );
}

import type { ReactNode } from "react";
import clsx from "clsx";
import styles from './ConstructorSelection.module.scss';
import {
  PlusIcon,
  CheckmarkIcon,
  ArrowUpIcon,
} from '@/assets/icons/constructor';

interface ConstructorSelectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  value?: string;
  isComplete?: boolean;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

export function ConstructorSelection({
  icon,
  title,
  description,
  value,
  isComplete,
  isOpen,
  onToggle,
  children,
}: ConstructorSelectionProps) {
  const completed = isComplete ?? Boolean(value);

  const status = isOpen
    ? {
        text: "Свернуть",
        color: "#0E68D4",
        Icon: ArrowUpIcon,
      }
    : completed
      ? {
          text: "Готово",
          color: "#3CB371",
          Icon: CheckmarkIcon,
        }
      : {
          text: "Добавить",
          color: undefined,
          Icon: PlusIcon,
        };

  const StatusIcon = status.Icon;

  return (
    <div
      className={clsx(styles.card, {
        [styles.cardOpen]: isOpen,
      })}
      style={status.color ? { borderColor: status.color } : undefined}
      onClick={onToggle}
    >
      <div className={styles.header}>
        <div className={styles.main}>
          <div
            className={styles.iconWrapper}
            style={
              status.color
                ? { backgroundColor: `${status.color}1A` }
                : undefined
            }
          >
            <div
              className={styles.icon}
              style={status.color ? { color: status.color } : undefined}
            >
              {icon}
            </div>
          </div>

          <div className={styles.info}>
            <h2
              className={styles.title}
              style={
                isOpen && status.color ? { color: status.color } : undefined
              }
            >
              {title}
            </h2>

            <p className={styles.description}>
              {value ?? description}
            </p>
          </div>
        </div>

        <div
          className={styles.status}
          style={status.color ? { color: status.color } : undefined}
        >
          <span>{status.text}</span>
          <span className={styles.statusIcon} aria-hidden="true">
            <StatusIcon />
          </span>
        </div>
      </div>

      {isOpen && (
        <div className={styles.content} onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      )}
    </div>
  );
}

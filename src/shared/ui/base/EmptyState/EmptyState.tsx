import type { ReactNode } from "react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>
        {icon}
      </div>

      <h3 className={styles.title}>
        {title}
      </h3>

      <p className={styles.description}>
        {description}
      </p>
    </div>
  );
}

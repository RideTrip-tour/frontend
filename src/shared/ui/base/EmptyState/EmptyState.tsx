import type { ReactNode } from "react";
import styles from "./EmptyState.module.scss";

interface EmptyStateProps {
  className?: string;
  variant?: 'default' | 'message';
  icon: ReactNode;
  title: string;
  description: string;
}

export function EmptyState({
  className = "",
  variant = "default",
  icon,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className={[
      styles.emptyState,
      variant === 'message' ? styles.message : '',
      className,
    ].filter(Boolean).join(' ')}>
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

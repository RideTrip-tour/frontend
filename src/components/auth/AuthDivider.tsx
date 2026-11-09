import styles from './AuthForm.module.scss';

type AuthDividerProps = {
  text?: string;
};

export default function AuthDivider({ text = 'Или' }: AuthDividerProps) {
  return (
    <div className={styles.divider}>
      <span className={styles.dividerLine} />
      <span className={styles.dividerText}>{text}</span>
      <span className={styles.dividerLine} />
    </div>
  );
}

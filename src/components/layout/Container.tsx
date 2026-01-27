import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 16px",
        width: "100%"
      }}
    >
      {children}
    </div>
  );
}

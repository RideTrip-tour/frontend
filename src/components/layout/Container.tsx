import type { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
  className?: string;
}>;

export function Container({ children, className }: ContainerProps) {
  return (
    <div
      className={className}
      style={{
        width: "1440px",
        flexShrink: 0,
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
}

import type { FC, ReactNode } from "react";

export const InfoSectionContainer: FC<{
  children: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div
      className={`border-info-item-border flex flex-row overflow-hidden rounded-md border bg-button ${className}`}
    >
      {children}
    </div>
  );
};

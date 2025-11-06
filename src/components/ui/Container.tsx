import { ReactNode } from "react";
import clsx from "clsx";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx("max-w-6xl w-full mx-auto px-4 md:px-6", className)}>
      {children}
    </div>
  );
}
import { ReactNode, CSSProperties } from "react";
import clsx from "clsx";

type Props = {
  id?: string;
  pad?: "sm" | "md" | "lg";
  tint?: "none" | "subtle" | "brand";
  bgImage?: string;
  overlay?: boolean;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
};

const tintMap = {
  none: "",
  subtle: "bg-gradient-to-br from-black/80 to-sky-800/60",
  brand: "bg-gradient-to-br from-[hsl(var(--brand-600))]/60 to-black/40",
};

export function Section({
  id,
  pad = "lg",
  tint = "none",
  bgImage,
  overlay = false,
  className,
  children,
  style,
}: Props) {
  return (
    <section
      id={id}
      className={clsx("relative overflow-hidden", pad, bgImage ? "bg-cover bg-center" : "", className)}
      style={{ backgroundImage: bgImage ? `url('${bgImage}')` : undefined, ...style }}
    >
      {/* overlay/tinta */}
      {(overlay || tint !== "none") && (
        <div className={clsx("absolute inset-0 -z-0", tintMap[tint])} />
      )}
      {/* brilho radial sutil */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(99,102,241,0.20),transparent_70%)]" />
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
}
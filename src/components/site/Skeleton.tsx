import type { CSSProperties } from "react";

export function GoldSkeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return <div className={`gold-skeleton ${className ?? ""}`} style={style} />;
}

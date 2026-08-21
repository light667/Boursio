import React from "react";
import { SubscriptionPlan } from "@/lib/types";
import { Crown, Sparkles, Zap } from "lucide-react";

interface PlanBadgeProps {
  plan: SubscriptionPlan;
  className?: string;
  onUpgradeClick?: () => void;
  showUpgradeBtn?: boolean;
}

export const PlanBadge: React.FC<PlanBadgeProps> = ({
  plan,
  className = "",
  onUpgradeClick,
  showUpgradeBtn = false,
}) => {
  if (plan === "max") {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 px-3 py-1 text-xs font-extrabold text-amber-500 border border-amber-500/40 shadow-sm ${className}`}>
        <Sparkles className="h-3.5 w-3.5 fill-amber-500" />
        <span>PLAN MAX 98%</span>
      </div>
    );
  }

  if (plan === "pro") {
    return (
      <div className={`inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-3 py-1 text-xs font-bold text-primary border border-primary/40 shadow-sm ${className}`}>
        <Zap className="h-3.5 w-3.5 fill-primary" />
        <span>PLAN PRO</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground border border-border">
        Compte Gratuit
      </span>
      {showUpgradeBtn && onUpgradeClick && (
        <button
          type="button"
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-blue-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-glow hover:opacity-90 transition-opacity"
        >
          <Crown className="h-3 w-3" /> Passer en Pro
        </button>
      )}
    </div>
  );
};

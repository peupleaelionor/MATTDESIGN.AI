import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Button ───────────────────────────────────────────────────────────────────

const buttonVariants = cva(
  // base
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1E] disabled:pointer-events-none disabled:opacity-40 select-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-[#1E293B] text-slate-200 border border-[#1E293B] hover:bg-[#263348] hover:border-slate-600 active:scale-[0.98]",
        outline:
          "border border-slate-700 text-slate-300 hover:border-blue-500 hover:text-white hover:bg-blue-500/10 active:scale-[0.98]",
        ghost:
          "text-slate-400 hover:text-white hover:bg-white/5 active:scale-[0.98]",
        accent:
          "bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg hover:shadow-emerald-400/30 hover:scale-[1.02] active:scale-[0.98]",
        danger:
          "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
      },
      size: {
        sm: "h-8 px-4 text-xs",
        md: "h-10 px-5 text-sm",
        lg: "h-12 px-7 text-base",
        xl: "h-14 px-9 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : leftIcon}
        {children}
        {!loading && rightIcon}
      </button>
    );
  },
);
Button.displayName = "Button";

// ─── Badge ────────────────────────────────────────────────────────────────────

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
        violet: "bg-violet-500/15 text-violet-400 border border-violet-500/20",
        accent: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
        muted: "bg-slate-800 text-slate-400 border border-slate-700",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
        danger: "bg-red-500/15 text-red-400 border border-red-500/20",
        success: "bg-green-500/15 text-green-400 border border-green-500/20",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: "blue" | "violet" | "accent" | "none";
  glass?: boolean;
}

export function Card({ className, hover, glow = "none", glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[#1E293B] bg-[#111827] p-6",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500/40",
        glass && "backdrop-blur-xl bg-[#111827]/80",
        glow === "blue" && "[box-shadow:0_0_24px_rgba(59,130,246,0.15)]",
        glow === "violet" && "[box-shadow:0_0_24px_rgba(124,58,237,0.15)]",
        glow === "accent" && "[box-shadow:0_0_24px_rgba(6,214,160,0.15)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-lg border bg-[#0A0F1E] px-4 text-sm text-slate-100 placeholder:text-slate-600",
            "border-[#1E293B] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50",
            "transition-colors disabled:opacity-40",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";

// ─── Textarea ─────────────────────────────────────────────────────────────────

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "min-h-24 w-full resize-y rounded-lg border bg-[#0A0F1E] px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600",
            "border-[#1E293B] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50",
            "transition-colors disabled:opacity-40",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

// ─── Select ───────────────────────────────────────────────────────────────────

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn(
            "h-11 w-full appearance-none rounded-lg border bg-[#0A0F1E] px-4 text-sm text-slate-100",
            "border-[#1E293B] focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50",
            "transition-colors cursor-pointer disabled:opacity-40",
            error && "border-red-500",
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    );
  },
);
Select.displayName = "Select";

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  variant?: "default" | "accent" | "violet";
  size?: "sm" | "md";
  className?: string;
  showValue?: boolean;
}

export function Progress({
  value,
  max = 100,
  label,
  variant = "default",
  size = "md",
  className,
  showValue,
}: ProgressProps) {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  const fillColors = {
    default: "from-blue-500 to-violet-600",
    accent: "from-emerald-400 to-blue-500",
    violet: "from-violet-500 to-pink-500",
  };
  const heights = { sm: "h-1", md: "h-2" };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-xs text-slate-400">{label}</span>}
          {showValue && <span className="text-xs tabular-nums text-slate-400">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={cn("w-full overflow-hidden rounded-full bg-[#1E293B]", heights[size])}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full bg-gradient-to-r transition-all duration-500 ease-out",
            fillColors[variant],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Divider ─────────────────────────────────────────────────────────────────

export function Divider({ className }: { className?: string }) {
  return <hr className={cn("border-[#1E293B]", className)} />;
}

// ─── Score Ring ───────────────────────────────────────────────────────────────

export function ScoreRing({
  score,
  size = 80,
  className,
}: {
  score: number;
  size?: number;
  className?: string;
}) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#06D6A0" : score >= 60 ? "#3B82F6" : score >= 40 ? "#F59E0B" : "#EF4444";

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke="#1E293B" strokeWidth={8} fill="none"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          stroke={color} strokeWidth={8} fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <span className="absolute text-sm font-bold tabular-nums" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

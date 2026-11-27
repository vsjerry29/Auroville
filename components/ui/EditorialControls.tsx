"use client";

import React from "react";
import { ArrowUp, ArrowUpRight, RotateCcw } from "lucide-react";

// =============================================================================
// EDITORIAL ACTION — Pure text-driven action with animated hairline underline
// Zero permanent rectangular boxes, heavy shadows, or pill chrome.
// =============================================================================
interface EditorialActionProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
  arrow?: "up" | "up-right" | "back" | "none";
  ariaLabel?: string;
  className?: string;
  underlineColor?: "terracotta" | "ink";
}

export function EditorialAction({
  children,
  onClick,
  href,
  target,
  rel,
  arrow = "none",
  ariaLabel,
  className = "",
  underlineColor = "terracotta",
}: EditorialActionProps) {
  const arrowNode =
    arrow === "up" ? (
      <ArrowUp
        size={13}
        className="text-terracotta transition-transform duration-300 group-hover:-translate-y-0.5 shrink-0"
        aria-hidden="true"
      />
    ) : arrow === "up-right" ? (
      <ArrowUpRight
        size={14}
        className="text-terracotta transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0"
        aria-hidden="true"
      />
    ) : arrow === "back" ? (
      <RotateCcw
        size={12}
        className="text-terracotta transition-transform duration-300 group-hover:-rotate-45 shrink-0"
        aria-hidden="true"
      />
    ) : null;

  const lineBg = underlineColor === "terracotta" ? "bg-terracotta" : "bg-ink";

  const innerContent = (
    <>
      {arrow === "back" || arrow === "up" ? arrowNode : null}
      <span className="relative inline-block py-1">
        <span>{children}</span>
        <span
          aria-hidden="true"
          className={`pointer-events-none block h-[1px] w-full ${lineBg} origin-left scale-x-0 group-hover:scale-x-100 group-focus-visible:scale-x-100 transition-transform duration-300 ease-out`}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none block -mt-[1px] h-[1px] w-full bg-ink/25 group-hover:opacity-0 transition-opacity duration-300"
        />
      </span>
      {arrow === "up-right" ? arrowNode : null}
    </>
  );

  const sharedClasses =
    "group relative inline-flex items-center gap-2 min-h-[44px] px-1 text-ink hover:text-terracotta transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-4 bg-transparent border-0 " +
    className;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
        className={sharedClasses}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={sharedClasses}
    >
      {innerContent}
    </button>
  );
}

// =============================================================================
// INDEX OPTION — Unboxed numeric/titled index item with animated rule
// =============================================================================
interface IndexOptionProps {
  number: string;
  label?: string;
  active?: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
  ariaSelected?: boolean;
  role?: "tab" | "button";
  orientation?: "vertical" | "horizontal";
  className?: string;
}

export function IndexOption({
  number,
  label,
  active = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onKeyDown,
  ariaLabel,
  ariaSelected,
  role,
  orientation = "vertical",
  className = "",
}: IndexOptionProps) {
  return (
    <button
      type="button"
      role={role}
      aria-selected={role === "tab" ? ariaSelected ?? active : undefined}
      aria-current={!role && active ? "true" : undefined}
      aria-label={ariaLabel || (label ? `${number} ${label}` : number)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      className={`group inline-flex ${
        orientation === "horizontal"
          ? "flex-col items-center justify-center min-h-[44px] min-w-[36px] px-1.5"
          : "items-center gap-2.5 min-h-[36px] py-0.5"
      } font-sans text-sm tracking-wider transition-colors duration-200 cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 ${
        active
          ? "text-ink font-bold"
          : "text-ink-faint hover:text-ink font-light"
      } ${className}`}
    >
      {orientation === "vertical" && (
        <span
          aria-hidden="true"
          className={`h-[1.5px] transition-all duration-300 ${
            active
              ? "w-5 bg-terracotta"
              : "w-0 bg-ink-muted group-hover:w-2.5 group-focus-visible:w-2.5"
          }`}
        />
      )}
      <span>{number}</span>
      {label && <span className="font-serif font-light">{label}</span>}
      {orientation === "horizontal" && (
        <span
          aria-hidden="true"
          className={`mt-1 h-[1.5px] transition-all duration-300 ${
            active
              ? "w-4 bg-terracotta"
              : "w-0 bg-ink-muted group-hover:w-3"
          }`}
        />
      )}
    </button>
  );
}

// =============================================================================
// INLINE LABEL — Clean borderless microtype annotation (never looks clickable)
// =============================================================================
interface InlineLabelProps {
  children: React.ReactNode;
  accent?: "terracotta" | "forest" | "gold" | "muted";
  className?: string;
}

export function InlineLabel({
  children,
  accent = "muted",
  className = "",
}: InlineLabelProps) {
  const colorMap = {
    terracotta: "text-terracotta",
    forest: "text-forest",
    gold: "text-gold-dark",
    muted: "text-ink-muted",
  };
  return (
    <span
      className={`inline-block font-mono text-[9.5px] uppercase tracking-[0.18em] ${colorMap[accent]} ${className}`}
    >
      {children}
    </span>
  );
}

// =============================================================================
// ICON ACTION — Uncluttered icon button with accessible hit area
// =============================================================================
interface IconActionProps {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
  className?: string;
}

export function IconAction({
  onClick,
  ariaLabel,
  children,
  className = "",
}: IconActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`inline-flex items-center justify-center min-w-[36px] min-h-[36px] text-ink-muted hover:text-terracotta transition-colors duration-200 cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}

// =============================================================================
// FEATURE TOGGLE — Clean unobtrusive typographic binary selector
// =============================================================================
interface FeatureToggleOption<T extends string> {
  value: T;
  label: string;
  accent?: "terracotta" | "forest" | "ink";
}

interface FeatureToggleProps<T extends string> {
  options: [FeatureToggleOption<T>, FeatureToggleOption<T>];
  value: T;
  onChange: (val: T) => void;
  ariaLabel: string;
  className?: string;
}

export function FeatureToggle<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className = "",
}: FeatureToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-3 ${className}`}
    >
      {options.map((opt, i) => {
        const isSelected = opt.value === value;
        const activeUnderline =
          opt.accent === "forest"
            ? "bg-forest"
            : opt.accent === "terracotta"
            ? "bg-terracotta"
            : "bg-ink";
        const activeText =
          opt.accent === "forest"
            ? "text-forest"
            : opt.accent === "terracotta"
            ? "text-terracotta"
            : "text-ink";

        return (
          <React.Fragment key={opt.value}>
            {i > 0 && (
              <span className="text-ink-faint font-serif text-xs select-none" aria-hidden="true">
                /
              </span>
            )}
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(opt.value)}
              className={`group relative py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] transition-colors cursor-pointer bg-transparent border-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta focus-visible:outline-offset-2 ${
                isSelected ? `${activeText} font-semibold` : "text-ink-muted hover:text-ink"
              }`}
            >
              <span>{opt.label}</span>
              <span
                aria-hidden="true"
                className={`block mt-0.5 h-[1.5px] w-full transition-transform duration-200 origin-left ${
                  isSelected
                    ? `${activeUnderline} scale-x-100`
                    : "bg-ink/30 scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}

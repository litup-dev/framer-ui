import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

const hasLeadingClass = (className?: string): boolean => {
  if (!className) return false;
  return /\bleading-/.test(className);
};

export const Title = ({
  children,
  className,
  as: Component = "h1",
}: TypographyProps) => {
  return (
    <Component
      className={cn(
        "font-bold",
        "tracking-[-0.08em]",
        !hasLeadingClass(className) && "leading-percent",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const Subtitle = ({
  children,
  className,
  onClick,
  as: Component = "h2",
}: TypographyProps & { onClick?: () => void }) => {
  return (
    <Component
      onClick={onClick}
      className={cn(
        "font-bold",
        "tracking-[-0.04em]",
        !hasLeadingClass(className) && "leading-percent",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const Description = ({
  children,
  className,
  as: Component = "p",
}: TypographyProps) => {
  return (
    <Component
      className={cn(
        "font-semibold",
        "tracking-[-0.04em]",
        !hasLeadingClass(className) && "leading-percent",
        className,
      )}
    >
      {children}
    </Component>
  );
};

export const Chip = ({
  children,
  className,
  as: Component = "span",
}: TypographyProps) => {
  return (
    <Component
      className={cn(
        "font-medium",
        "tracking-[0]",
        !hasLeadingClass(className) && "leading-percent",
        className,
      )}
    >
      {children}
    </Component>
  );
};

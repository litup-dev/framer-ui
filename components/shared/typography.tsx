import { cn } from "@/lib/utils";

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
}

export const Title = ({
  children,
  className,
  as: Component = "h1",
}: TypographyProps) => {
  return (
    <Component className={cn("font-bold", "tracking-[-0.08em]", className)}>
      {children}
    </Component>
  );
};

export const Subtitle = ({
  children,
  className,
  as: Component = "h2",
}: TypographyProps) => {
  return (
    <Component className={cn("font-bold", "tracking-[-0.04em]", className)}>
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
    <Component className={cn("font-medium", "tracking-[-0.04em]", className)}>
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
    <Component className={cn("font-medium", "tracking-[0]", className)}>
      {children}
    </Component>
  );
};

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
    <Component
      className={cn(
        "font-bold text-[24px] md:text-[28px] lg:text-[32px]",
        "tracking-[-0.08em]",
        className
      )}
    >
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
    <Component
      className={cn(
        "font-bold text-[14px] md:text-[15px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px]",
        "tracking-[-0.04em]",
        className
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
        "font-medium text-[14px] md:text-[16px]",
        "tracking-[-0.04em]",
        className
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
        "font-medium text-[12px] md:text-[14px] lg:text-[16px] xl:text-[18px]",
        "tracking-[0]",
        className
      )}
    >
      {children}
    </Component>
  );
};

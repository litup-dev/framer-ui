import { ReactNode } from "react";
import { Title } from "@/components/shared/typography";
import { Separator } from "@/components/ui/separator";
import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  iconClassName?: string;
  titleClassName?: string;
  action?: ReactNode;
}

export default function SectionHeader({
  icon: Icon,
  title,
  iconClassName = "w-7 h-7 lg:w-8 lg:h-8",
  titleClassName = "text-[18px] md:text-[20px] lg:text-[24px]",
  action,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className={iconClassName} />
          <Title className={titleClassName}>{title}</Title>
        </div>
        {action}
      </div>
      <Separator className="!h-[2px] md:!h-[3px] bg-main mt-3" />
    </div>
  );
}

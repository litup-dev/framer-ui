import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface SortOption<T extends string> {
  value: T;
  label: string;
}

interface SortDropdownProps<T extends string> {
  value: T;
  options: SortOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export default function SortDropdown<T extends string>({
  value,
  options,
  onChange,
  className = "flex justify-end mt-4",
}: SortDropdownProps<T>) {
  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 font-semibold text-[14px] lg:text-[16px] text-muted-foreground hover:text-black transition-colors">
            <span>{options.find((opt) => opt.value === value)?.label}</span>
            <ChevronDown className="w-4 h-4 lg:w-5 lg:h-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { Checkbox } from "@/components/ui/checkbox";

interface ViewingHistoryEditControlsProps {
  selectedCount: number;
  totalCount: number;
  allSelected: boolean;
  onSelectAll: (checked: boolean) => void;
  onDelete: () => void;
}

export default function ViewingHistoryEditControls({
  selectedCount,
  totalCount,
  allSelected,
  onSelectAll,
  onDelete,
}: ViewingHistoryEditControlsProps) {
  return (
    <>
      <div className="flex items-center gap-2">
        <Checkbox
          checked={allSelected && totalCount > 0}
          onCheckedChange={onSelectAll}
          className="w-[15px] h-[15px] lg:w-[18px] lg:h-[18px] border-[#222222]/20 rounded-[3px] data-[state=checked]:bg-transparent data-[state=checked]:border-[#222222]/20 data-[state=checked]:text-[#202020]/80 shadow-none"
        />
        <span className="text-[14px] xl:text-[16px] font-semibold">
          {selectedCount}개 선택
        </span>
      </div>
      <button
        onClick={onDelete}
        disabled={selectedCount === 0}
        className="text-[14px] xl:text-[16px] font-semibold text-main hover:text-main/70 disabled:text-muted-foreground disabled:cursor-not-allowed"
      >
        선택항목 삭제
      </button>
    </>
  );
}

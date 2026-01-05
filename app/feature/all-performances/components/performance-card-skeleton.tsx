import { Card, CardContent } from "@/components/ui/card";

export const PerformanceCardSkeleton = () => {
  return (
    <Card className="overflow-hidden gap-3 pb-2">
      <div className="aspect-[3/4] relative bg-gray-200 animate-pulse" />
      <CardContent className="flex flex-col justify-start truncate gap-2.5">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
      </CardContent>
    </Card>
  );
};

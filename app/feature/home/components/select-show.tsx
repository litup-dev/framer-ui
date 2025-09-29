import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectShowProps {
  onCategoryChange: (value: string) => void;
}

const SelectShow = ({ onCategoryChange }: SelectShowProps) => {
  return (
    <Select onValueChange={onCategoryChange}>
      <SelectTrigger className="w-[260px]">
        <SelectValue placeholder="공연분류" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>공연분류</SelectLabel>
          <SelectItem value="today">금일 공연</SelectItem>
          <SelectItem value="week">금주 공연</SelectItem>
          <SelectItem value="month">월간 공연</SelectItem>
          <SelectItem value="hongdae">홍대 공연</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectShow;

"use client";

import { useFormContext } from "react-hook-form";
import { SearchIcon } from "lucide-react";

import { ClubSearchFormSchema } from "@/app/feature/club/schema";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormControl, FormField } from "@/components/ui/form";

interface SearchFormFieldProps {
  onFocus?: () => void;
}

const SearchFormField = ({ onFocus }: SearchFormFieldProps) => {
  const { control, handleSubmit } = useFormContext<ClubSearchFormSchema>();

  const onSubmit = (data: ClubSearchFormSchema) => {
    console.log(data);
  };

  return (
    <FormField
      control={control}
      name="search"
      render={({ field }) => (
        <div className="space-y-2">
          <InputGroup className="bg-[#2020200A] border-none h-12 rounded-[4px]">
            <FormControl>
              <InputGroupInput
                placeholder="검색어를 입력하세요."
                className="placeholder:text-[#2020204D]"
                onFocus={onFocus}
                {...field}
              />
            </FormControl>
            <InputGroupAddon
              align="inline-end"
              onClick={handleSubmit(onSubmit)}
            >
              <SearchIcon className="size-5 text-[#FF491A]" strokeWidth={3} />
            </InputGroupAddon>
          </InputGroup>
        </div>
      )}
    />
  );
};

export default SearchFormField;

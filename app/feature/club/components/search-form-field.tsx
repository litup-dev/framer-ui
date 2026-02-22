"use client";

import { useEffect, useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { SearchIcon } from "lucide-react";

import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { useDebounce } from "@/hooks/use-debounce";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormControl, FormField } from "@/components/ui/form";
import Image from "next/image";

interface SearchFormFieldProps {
  onFocus?: () => void;
}

const SearchFormField = ({ onFocus }: SearchFormFieldProps) => {
  const { control, handleSubmit, setValue } =
    useFormContext<ClubSearchFormSchema>();
  const [inputValue, setInputValue] = useState<string>("");
  const debouncedValue = useDebounce(inputValue, 500);

  useEffect(() => {
    setValue("search", debouncedValue, { shouldDirty: false });
  }, [debouncedValue, setValue]);

  const onSubmit = (data: ClubSearchFormSchema) => {
    console.log(data);
  };

  return (
    <FormField
      control={control}
      name="search"
      render={({ field }) => (
        <div className="space-y-2 pt-3">
          <InputGroup className="border-b-3 border-main h-12 xl:min-h-[64px]">
            <InputGroupAddon
              align="inline-start"
              onClick={handleSubmit(onSubmit)}
            >
              <Image
                src="/images/search-icon.svg"
                alt="search"
                width={32}
                height={32}
              />
            </InputGroupAddon>
            <FormControl>
              <InputGroupInput
                placeholder="검색어를 입력하세요."
                className="placeholder:text-[#2020204D] placeholder:2xl:text-[18px] 2xl:text-[18px]"
                onFocus={onFocus}
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;
                  setInputValue(value);
                }}
              />
            </FormControl>
          </InputGroup>
        </div>
      )}
    />
  );
};

export default SearchFormField;

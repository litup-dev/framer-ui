"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import { ClubSearchFormSchema } from "@/app/feature/club/schema";
import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FormControl, FormField } from "@/components/ui/form";
import Image from "next/image";

interface SearchFormFieldProps {
  variant?: "mobile" | "desktop";
  onFocus?: () => void;
}

const SearchFormField = ({
  variant = "desktop",
  onFocus,
}: SearchFormFieldProps) => {
  const isMobile = variant === "mobile";
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
        <div
          className={cn(
            "space-y-2 pt-0 xl:pt-2 2xl:pt-3",
            isMobile && "pt-0 md:pt-2",
          )}
        >
          <InputGroup className="h-14 lg:min-h-[56px] xl:min-h-[56px] 2xl:min-h-[64px] lg:border-b-3 lg:border-main">
            <InputGroupAddon
              align="inline-start"
              className={cn(
                isMobile &&
                  "!pl-5 !pr-4 sm:!pl-10 md:!pl-[38px] sm:!pr-4 lg:!pl-[38px] md:!pr-4",
                !isMobile && "lg:!pr-2",
              )}
              onClick={handleSubmit(onSubmit)}
            >
              <Image
                src="/images/search-icon.svg"
                alt="search"
                width={28}
                height={28}
                className="hidden lg:block"
              />
              <Image
                className="block lg:hidden"
                src="/images/search-icon-mobile.svg"
                alt="search"
                width={24}
                height={24}
              />
            </InputGroupAddon>
            <div className="flex min-w-0 flex-1 items-center border-b-2 border-main sm:border-b-3 lg:border-0">
              <FormControl>
                <InputGroupInput
                  placeholder="검색어를 입력하세요."
                  className="!pl-0 placeholder:text-[#2020204D] text-[16px] lg:text-[18px] placeholder:lg:text-[18px] 2xl:text-[18px] h-[48px]"
                  onFocus={onFocus}
                  value={inputValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    setInputValue(value);
                  }}
                />
              </FormControl>
              {inputValue.trim() && (
                <InputGroupAddon
                  align="inline-end"
                  onClick={() => setInputValue("")}
                  className="cursor-pointer !pr-[15px]"
                >
                  <Image
                    src="/images/x.svg"
                    alt="clear"
                    width={24}
                    height={24}
                  />
                </InputGroupAddon>
              )}
            </div>
          </InputGroup>
        </div>
      )}
    />
  );
};

export default SearchFormField;

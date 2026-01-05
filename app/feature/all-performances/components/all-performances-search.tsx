"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Subtitle } from "@/components/shared/typography";
import { AllPerformancesFormSchema } from "@/app/feature/all-performances/schema";

export const AllPerformancesSearch = () => {
  const { setValue } = useFormContext<AllPerformancesFormSchema>();
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    const trimmedKeyword = inputValue.trim() || undefined;
    setValue("keyword", trimmedKeyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="pb-5">
      <InputGroup className="border-0 rounded-none shadow-none pb-5 w-full border-b-2 border-black">
        <Input
          placeholder="공연명 또는 아티스트를 검색하세요"
          className="border-none p-0 placeholder:text-black/30"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <InputGroupAddon align="inline-end">
          <Button
            className="bg-gray text-black w-[46px] sm:w-[64px] h-[34px] sm:h-[44px] rounded-none hover:bg-gray p-0"
            onClick={handleSearch}
          >
            <Subtitle className="text-[14px] sm:text-[16px]">검색</Subtitle>
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Subtitle } from "@/components/shared/typography";
import { NoticeFormSchema } from "@/app/feature/notice/schema";

const DEBOUNCE_MS = 300;

export const NoticeSearch = () => {
  const { setValue } = useFormContext<NoticeFormSchema>();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue("keyword", inputValue.trim() || undefined);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [inputValue, setValue]);

  const handleSearch = () => {
    setValue("keyword", inputValue.trim() || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="pb-5">
      <InputGroup className="border-0 rounded-none shadow-none w-full border-b-2 border-black min-h-[50px] xl:min-h-[60px]">
        <Input
          placeholder="제목 또는 내용으로 검색하세요"
          className="border-none p-0 placeholder:text-black/30 shadow-none placeholder:text-[16px] text-[16px] 2xl:placeholder:text-[18px] 2xl:text-[18px] text-black"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <InputGroupAddon align="inline-end">
          <Button
            className="bg-gray text-black w-[46px] md:w-[56px] xl:w-[64px] h-[34px] md:h-[38px] xl:h-[44px] rounded-[3px] hover:bg-gray p-0"
            onClick={handleSearch}
          >
            <Subtitle className="text-[14px] xl:text-[16px]">검색</Subtitle>
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

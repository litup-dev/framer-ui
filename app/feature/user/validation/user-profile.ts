import { z } from "zod";

// 연속된 공백을 체크하는 함수
const hasConsecutiveSpaces = (value: string) => /\s{2,}/.test(value);

// 공백을 제거한 길이를 체크하는 함수
const getTextLengthWithoutSpaces = (value: string) => value.replace(/\s/g, "").length;

export const userProfileSchema = z.object({
  nickname: z
    .string()
    .min(1, "닉네임을 입력해주세요")
    .max(23, "닉네임은 최대 23자까지 입력 가능합니다")
    .refine((val) => {
      const lengthWithoutSpaces = getTextLengthWithoutSpaces(val);
      return lengthWithoutSpaces >= 3;
    }, "닉네임은 공백을 제외하고 최소 3글자 이상이어야 합니다")
    .refine((val) => {
      const lengthWithoutSpaces = getTextLengthWithoutSpaces(val);
      return lengthWithoutSpaces <= 13;
    }, "닉네임은 공백을 제외하고 최대 13글자까지 입력 가능합니다")
    .refine((val) => !hasConsecutiveSpaces(val), "연속된 공백은 사용할 수 없습니다"),

  bio: z
    .string()
    .max(255, "자기소개는 최대 255자까지 입력 가능합니다"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

import { z } from "zod";

export const clubSearchFormSchema = z.object({
  search: z.string().min(5, { message: "검색어는 5자 이상이어야 합니다." }),
  region: z.string().optional(),
  reviewSort: z.string().optional(),
  reviewDate: z.string().optional(),
  ratingSort: z.string().optional(),
});

export type ClubSearchFormSchema = z.infer<typeof clubSearchFormSchema>;

export const defaultValues: ClubSearchFormSchema = {
  search: "",
  region: "",
  reviewSort: "review_count_desc",
  reviewDate: "recent_review_desc",
  ratingSort: "rating_desc",
};

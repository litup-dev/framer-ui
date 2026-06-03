import { z } from "zod";

export const noticeFormSchema = z.object({
  keyword: z.string().optional(),
  sort: z.enum(["-createdAt", "createdAt", "-title", "title"]),
});

export type NoticeFormSchema = z.infer<typeof noticeFormSchema>;

export const defaultValues: NoticeFormSchema = {
  keyword: undefined,
  sort: "-createdAt",
};

export const NOTICE_PAGE_SIZE = 10;

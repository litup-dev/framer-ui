import { z } from "zod";

export const allPerformancesFormSchema = z.object({
  keyword: z.string().optional(),
  timeFilter: z.enum(["upcoming", "past"]),
  area: z.enum(["seoul", "hongdae", "busan", "other"]).optional(),
});

export type AllPerformancesFormSchema = z.infer<
  typeof allPerformancesFormSchema
>;

export const defaultValues: AllPerformancesFormSchema = {
  keyword: undefined,
  timeFilter: "upcoming",
  area: undefined,
};

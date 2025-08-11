import { queryOptions } from "@tanstack/react-query";

const getDomainOptions = (id: string) =>
  queryOptions({
    queryKey: ["domain-options", id],
    queryFn: (): Promise<string> =>
      new Promise((resolve) => {
        setTimeout(() => {
          console.log(id);
          resolve("재사용 가능한 쿼리 옵션");
        }, 1000);
      }),
  });

export { getDomainOptions };

import axios from "axios";

import { queryOptions } from "@tanstack/react-query";
import { Posts } from "@/app/feature/home/types";

const getDomainOptions = () =>
  queryOptions({
    queryKey: ["domain-options"],
    queryFn: async () => {
      const res = await axios.get<Posts[]>(
        "https://676d15200e299dd2ddfe5d98.mockapi.io/todos"
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

export { getDomainOptions };

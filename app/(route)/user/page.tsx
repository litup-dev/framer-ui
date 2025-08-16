"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";

import UserMenus from "@/app/feature/user/components/menus";
import { getUserOptions } from "@/app/feature/user/query-options";

const UserPage = () => {
  const { data: user } = useSuspenseQuery(getUserOptions());

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <UserMenus user={user} />
    </motion.div>
  );
};

export default UserPage;

"use server";

import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    id: 1,
    name: "LeeBonHoon",
    email: "leebonhoo@gmail.com",
  });
};

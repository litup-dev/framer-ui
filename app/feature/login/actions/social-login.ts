"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface SocialLoginState {
  fieldErrors?: Record<string, string[]>;
  formErrors?: string[];
  success?: boolean;
  user?: any;
}

export async function googleLoginAction(
  _prevState: SocialLoginState,
  _formData: FormData
): Promise<SocialLoginState> {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      return {
        success: true,
        user: session.user,
      };
    }

    return {
      formErrors: ["Google 로그인에 실패했습니다."],
    };
  } catch {
    return {
      formErrors: ["로그인 중 오류가 발생했습니다."],
    };
  }
}

export async function kakaoLoginAction(
  _prevState: SocialLoginState,
  _formData: FormData
): Promise<SocialLoginState> {
  try {
    const session = await getServerSession(authOptions);

    if (session) {
      return {
        success: true,
        user: session.user,
      };
    }

    return {
      formErrors: ["카카오 로그인에 실패했습니다."],
    };
  } catch (error) {
    console.error("Kakao login error:", error);
    return {
      formErrors: ["로그인 중 오류가 발생했습니다."],
    };
  }
}

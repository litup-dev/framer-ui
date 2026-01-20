"use server";

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
  return {
    formErrors: ["현재 next-auth 제거로 인해 googleLoginAction은 비활성화되었습니다."],
  };
}

export async function kakaoLoginAction(
  provider: 'kakao' | 'google'
) {

  const response = await fetch(`${process.env.API_BASE_URL}/api/v1/auth/${provider}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return response.json();
}

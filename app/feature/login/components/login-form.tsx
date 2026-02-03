"use client";

import { LoginIcons } from "@/app/feature/login/components/icons";
import { Button } from "@/components/ui/button";

const LoginForm = () => {
  const handleGoogleLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google`;
  };

  const handleKakaoLogin = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/kakao`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">로그인</h2>
          <p className="mt-2 text-sm text-gray-600">
            소셜 계정으로 간편하게 로그인하세요
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={handleGoogleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoginIcons.GoogleIcon />
            </span>
            Google로 계속하기
          </Button>

          <Button
            onClick={handleKakaoLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-gray-900 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <LoginIcons.KakaoIcon />
            </span>
            카카오로 계속하기
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            계정이 없으신가요?{" "}
            <a
              href="#"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              회원가입
            </a>
          </p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            로그인 시{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              이용약관
            </a>{" "}
            및{" "}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              개인정보처리방침
            </a>{" "}
            에 동의하게 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

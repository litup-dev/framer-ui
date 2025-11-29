"use client";

import FadeIn from "@/components/shared/fade-in";

const NoticePage = () => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">공지사항</h1>
        <div className="space-y-4">
          <p className="text-gray-600">공지사항 내용이 여기에 표시됩니다.</p>
        </div>
      </div>
    </FadeIn>
  );
};

export default NoticePage;

"use client";

import FadeIn from "@/components/shared/fade-in";

const LocationBasedServiceTermsPage = () => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">
          litup 위치기반서비스 이용약관
        </h1>
        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold mb-4">
            litup 위치기반서비스 이용약관
          </h2>

          <section>
            <h3 className="text-lg font-semibold mb-3">제1조(목적)</h3>
            <p>
              이 약관은 litup(이하 "회사")이 제공하는 위치기반서비스(이하
              "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및
              책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제2조(정의)</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                <strong>위치기반서비스</strong>: 이용자의 현재 위치를 기반으로
                주변 장소 및 관련 정보를 제공하는 서비스
              </li>
              <li>
                <strong>위치정보</strong>: 서비스 이용 시 이용자의 현재 위치를
                일시적으로 확인하기 위한 정보
              </li>
              <li>
                <strong>이용자</strong>: 회사가 제공하는 서비스를 이용하는 회원
                또는 비회원
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제3조(약관의 효력 및 변경)
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                본 약관은 서비스 화면에 게시하거나 기타 방법으로 이용자에게
                공지함으로써 효력을 발생합니다.
              </li>
              <li>
                회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수
                있으며, 변경 시 적용일자 및 변경사유를 공지합니다.
              </li>
              <li>
                이용자가 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할
                수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제4조(서비스 제공 및 변경)
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 이용자의 현재 위치를 기반으로 주변 장소 정보를
                제공합니다.
              </li>
              <li>
                회사는 기술적·상업적 사유로 서비스의 일부 또는 전부를 변경,
                중단할 수 있습니다.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제5조(위치정보의 수집·이용)
            </h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                서비스 이용 시 위치정보는 단순 조회 목적으로만 사용되며, 별도로
                저장되지 않습니다.
              </li>
              <li>
                위치정보는 서비스 제공 목적 외에 이용되지 않으며, 제3자에게
                제공되지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제6조(개인정보 보호)</h3>
            <p>
              회사는 이용자의 위치정보를 저장하지 않지만, 다른 개인정보를
              수집하는 경우 관련 법령에 따라 안전하게 관리합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제7조(서비스 이용자의 의무)
            </h3>
            <p className="mb-4">
              이용자는 서비스 이용 시 다음 사항을 준수해야 합니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>타인의 위치정보를 무단으로 수집하거나 침해하지 않을 것</li>
              <li>서비스의 안정적 운영을 방해하지 않을 것</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제8조(면책조항)</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                회사는 천재지변, 통신장애 등 불가항력적 사유로 인한 서비스
                중단에 대해 책임을 지지 않습니다.
              </li>
              <li>
                이용자가 제공한 위치정보를 기반으로 발생한 불이익에 대해서는
                회사가 책임지지 않습니다.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제9조(분쟁해결)</h3>
            <p>
              서비스 이용과 관련한 분쟁은 회사 소재지 관할 법원을 제1심
              관할법원으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제10조(부칙)</h3>
            <p>본 약관은 2025년 01월 15일부터 시행합니다.</p>
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default LocationBasedServiceTermsPage;

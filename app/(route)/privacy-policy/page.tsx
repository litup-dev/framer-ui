"use client";

import FadeIn from "@/components/shared/fade-in";

const PrivacyPolicyPage = () => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">개인정보 처리방침</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <p className="mb-4">
            <strong>litup</strong>(이하 &quot;서비스&quot;)은 이용자의 개인정보를 소중히
            여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 개인정보
            처리방침은 서비스 이용 과정에서 어떤 개인정보가 수집·이용되며 어떻게
            보호되는지를 안내합니다.
          </p>

          <p className="mb-6">본 방침은 2026년 6월 3일부터 적용됩니다.</p>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              1. 개인정보 수집 항목 및 수집 방법
            </h3>
            <p className="mb-4">
              서비스는 아래와 같은 방법으로 개인정보를 수집합니다.
            </p>

            <div className="ml-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  (1) 소셜 로그인(Kakao, Google) 시
                </h4>
                <ul className="list-disc list-inside ml-4">
                  <li>필수: 이메일 주소</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  ※ 서비스는 외부 서비스 제공자(Kakao, Google)로부터 해당
                  이용자의 이메일 정보를 제공받습니다. 소셜 플랫폼이 제공하는
                  정보 외의 추가 정보는 수집하지 않습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  (2) 서비스 이용 중 이용자가 직접 입력하는 정보
                </h4>
                <ul className="list-disc list-inside ml-4">
                  <li>닉네임, 프로필 이미지</li>
                  <li>공연 관람 기록(보고 싶어요, 관람했어요)</li>
                  <li>댓글 및 리뷰 내용</li>
                  <li>즐겨찾기 클럽 정보</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">(3) 서비스 이용 시 자동으로 수집되는 정보</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>접속 로그, 서비스 이용 기록</li>
                  <li>브라우저 정보(기기 유형, 브라우저 종류 등)</li>
                  <li>인증 쿠키(accessToken, refreshToken 등 로그인 유지를 위한 정보)</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  ※ 자동 수집 정보는 서비스 안정성 및 보안을 위한 목적으로만
                  활용되며, 개인 식별에 단독 사용되지 않습니다.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              2. 개인정보 수집 및 이용 목적
            </h3>
            <p className="mb-4">서비스는 수집한 개인정보를 아래 목적으로만 활용합니다.</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>회원 식별 및 로그인 인증</li>
              <li>공연 관람 기록, 댓글 등 서비스 핵심 기능 제공</li>
              <li>로그인 상태 유지(쿠키 기반 인증)</li>
              <li>부정 이용 방지 및 운영 정책 위반 이용자 식별</li>
              <li>서비스 오류 파악 및 품질 개선</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※ litup은 광고, 마케팅, 뉴스레터 발송 등의 목적에 개인정보를
              활용하지 않습니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h3>
            <p className="mb-4">
              서비스는 원칙적으로 개인정보 수집·이용 목적이 달성되면 즉시
              파기합니다. 단, 아래의 경우 예외적으로 일정 기간 보관합니다.
            </p>

            <div className="ml-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">(1) 회원 탈퇴 시</h4>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    탈퇴 요청 즉시 이메일, 닉네임, 프로필 이미지, 공연 관람
                    기록, 작성한 댓글 및 리뷰 등 모든 개인정보 및 이용 기록을
                    완전 삭제합니다.
                  </li>
                  <li>삭제된 데이터는 복구할 수 없습니다.</li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              4. 개인정보의 제3자 제공
            </h3>
            <p>
              서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지
              않습니다. 단, 다음의 경우는 예외입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-3">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 따라 수사기관 등이 요구하는 경우</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              5. 개인정보 처리의 위탁
            </h3>
            <p className="mb-4">
              서비스는 현재 개인정보 처리 업무를 외부에 위탁하고 있지 않습니다.
              향후 위탁이 발생하는 경우 본 방침을 통해 사전 고지합니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">6. 쿠키 사용 안내</h3>
            <p className="mb-4">
              서비스는 로그인 상태 유지 및 보안을 위해 HTTP 쿠키를 사용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                사용 쿠키: accessToken, refreshToken, isLogin (로그인 인증 목적)
              </li>
              <li>
                해당 쿠키는 HttpOnly 속성이 적용되어 브라우저 스크립트에서 접근할
                수 없으며, 인증 목적 외에는 사용되지 않습니다.
              </li>
              <li>
                브라우저 설정에서 쿠키를 차단하면 로그인 기능이 정상 동작하지
                않을 수 있습니다.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              7. 이용자의 권리 및 행사 방법
            </h3>
            <p className="mb-4">
              이용자는 언제든지 본인의 개인정보에 대해 다음 권리를 행사할 수
              있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>개인정보 열람, 수정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴(서비스 내 설정 메뉴 또는 이메일 요청)</li>
            </ul>
            <p className="mt-3">
              요청은 아래 이메일로 문의하시면 지체 없이 처리합니다.
            </p>
            <ul className="list-disc list-inside mt-2 ml-4">
              <li>이메일: litup.live@gmail.com</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              8. 개인정보 보호를 위한 기술적·관리적 조치
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>인증 토큰은 HttpOnly 쿠키로 저장하여 XSS 공격으로부터 보호</li>
              <li>서버 및 데이터베이스 접근 권한 최소화</li>
              <li>외부 접근 제한 및 방화벽 운영</li>
              <li>주기적 보안 점검 수행</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              9. 개인정보 보호책임자
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>운영 주체: litup</li>
              <li>이메일: litup.live@gmail.com</li>
              <li>
                개인정보 관련 문의, 불만 처리, 피해 구제 등은 위 이메일로
                연락 주시기 바랍니다.
              </li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※ 개인정보 침해에 대한 신고·상담은 한국인터넷진흥원(KISA)
              개인정보침해신고센터(privacy.kisa.or.kr, 국번 없이 118)에서도
              가능합니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">10. 방침 변경 안내</h3>
            <p>
              본 방침이 변경될 경우 서비스 내 공지사항 또는 이메일을 통해 사전
              고지합니다. 변경된 방침은 공지일로부터 7일 후 효력이 발생하며,
              이용자에게 불리한 변경의 경우 30일 전에 고지합니다.
            </p>
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default PrivacyPolicyPage;

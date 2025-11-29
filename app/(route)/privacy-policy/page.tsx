"use client";

import FadeIn from "@/components/shared/fade-in";

const PrivacyPolicyPage = () => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">개인정보 처리방침</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold mb-4">개인정보 처리방침</h2>

          <p className="mb-4">
            <strong>onhz</strong>(이하 "플랫폼")은 이용자의 개인정보를 매우
            중요하게 생각하며, 「개인정보 보호법」 등 관련 법령을 준수하고
            있습니다. 본 개인정보 처리방침은 이용자가 플랫폼에서 제공하는
            서비스를 이용함에 있어, 어떤 개인정보가 수집·이용되고 있으며, 그
            정보가 어떻게 보호되는지를 안내하기 위한 것입니다.
          </p>

          <p className="mb-6">본 방침은 2025년 4월 22일부터 적용됩니다.</p>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              1. 개인정보 수집 항목 및 수집 방법
            </h3>
            <p className="mb-4">
              플랫폼은 회원가입, 소셜 로그인, 서비스 이용 과정에서 아래와 같은
              개인정보를 수집합니다.
            </p>

            <div className="ml-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2">
                  (1) 회원가입 시 수집 항목
                </h4>
                <ul className="list-disc list-inside ml-4">
                  <li>필수 항목: 이메일, 비밀번호, 닉네임</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  (2) 소셜 로그인(Google, Kakao, Naver) 시
                </h4>
                <ul className="list-disc list-inside ml-4">
                  <li>수집 항목: 이메일 주소</li>
                </ul>
                <p className="mt-2 text-sm text-gray-600">
                  ※ 소셜 로그인 사용 시 플랫폼은 외부 서비스 제공자(Google,
                  Kakao, Naver)로부터 해당 사용자의 이메일 정보를 제공받습니다.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">
                  (3) 서비스 이용 시 생성 또는 입력되는 정보
                </h4>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    작성한 리뷰, 평점, 게시글, 댓글, 업로드 이미지, 프로필
                    이미지 등
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">(4) 자동 수집 항목</h4>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    서비스 이용기록, 접속 로그, 브라우저 정보, 쿠키, 로컬/세션
                    스토리지 사용 기록
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              2. 개인정보 수집 및 이용 목적
            </h3>
            <p className="mb-4">
              플랫폼은 수집한 개인정보를 아래의 목적으로 활용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>회원가입, 로그인 및 회원 식별</li>
              <li>리뷰 작성 및 커뮤니티 기능 제공</li>
              <li>비밀번호 찾기 및 이메일 인증</li>
              <li>사용자 편의성 향상을 위한 로그인 유지</li>
              <li>부정 이용 방지 및 운영 정책 위반 사용자의 식별</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※ onhz는 광고, 마케팅, 뉴스레터 발송 등의 목적에 개인정보를
              활용하지 않으며, 개인화 추천 기능 또한 제공하지 않습니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              3. 개인정보의 보유 및 이용 기간
            </h3>
            <p className="mb-4">
              플랫폼은 원칙적으로 개인정보의 수집 및 이용 목적이 달성된 후에는
              해당 정보를 지체 없이 파기합니다. 단, 아래의 경우에는 예외로 일정
              기간 보관합니다.
            </p>

            <div className="ml-4">
              <h4 className="font-semibold mb-2">(1) 회원 탈퇴 시</h4>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  이메일, 비밀번호, 닉네임, 프로필 이미지는 탈퇴 요청일로부터
                  1개월 후 완전 삭제
                </li>
                <li>
                  해당 기간 동안은 통계 및 시스템 안정성 점검을 위한 최소한의
                  정보만 보관됨
                </li>
                <li>
                  이용자가 작성한 게시글 및 댓글은 "삭제된 사용자"로 표시되어
                  콘텐츠 내에 남습니다.
                </li>
                <li>또한 회원 탈퇴 시 계정은 복구 불가능합니다.</li>
              </ul>
            </div>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              4. 개인정보의 제3자 제공
            </h3>
            <p>
              플랫폼은 이용자의 개인정보를 제3자에게 제공하지 않으며, 향후 제공
              계획 또한 없습니다. 단, 법령에 의해 요구되는 경우에는 예외적으로
              제공할 수 있습니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              5. 개인정보 처리의 위탁
            </h3>
            <p className="mb-4">
              플랫폼은 원활한 서비스 운영을 위해 다음과 같은 업무에 대해
              개인정보 처리 업무를 위탁하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>위탁 항목: 이메일 인증 발송</li>
              <li>수탁 업체: Amazon Web Service SES</li>
              <li>위탁 목적: 회원가입 및 비밀번호 찾기 시 인증 메일 발송</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              ※ 위탁계약 체결 시 「개인정보 보호법」에 따라 개인정보 보호 관련
              조항을 명시하고, 수탁자가 안전하게 처리하도록 관리·감독합니다.
            </p>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">6. 쿠키 등 사용 안내</h3>
            <p className="mb-4">
              플랫폼은 로그인 상태 유지, 사용자 편의성 향상을 위해 쿠키와
              브라우저 로컬스토리지/세션스토리지를 사용합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                쿠키 및 스토리지를 통해 수집되는 정보는 개인을 식별할 수 없는
                범위에서 사용되며, 로그인 유지 및 사용자 환경 최적화에
                활용됩니다.
              </li>
              <li>
                사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수
                있습니다.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              7. 이용자의 권리 및 행사 방법
            </h3>
            <p className="mb-4">
              이용자는 언제든지 본인의 개인정보를 조회, 수정, 삭제, 처리 정지를
              요청할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>고객센터 이메일(onhz.cs@gmail.com)을 통해 요청 가능</li>
              <li>
                요청 시 본인 확인을 위해 일부 정보 제공을 요구할 수 있습니다
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              8. 개인정보 보호를 위한 기술적 및 관리적 조치
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>비밀번호는 일방향 암호화 방식으로 저장</li>
              <li>외부 접근 제한 및 방화벽 적용</li>
              <li>서버 및 데이터베이스에 대한 접근 통제</li>
              <li>주기적 보안 점검 수행</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">
              9. 개인정보 보호책임자
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>책임자: 웹얼라들</li>
              <li>이메일: onhz.cs@gmail.com</li>
              <li>문의사항이 있으시면 언제든지 연락 주시기 바랍니다.</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-300" />

          <section>
            <h3 className="text-lg font-semibold mb-3">10. 변경에 대한 고지</h3>
            <p>
              본 개인정보처리방침이 변경되는 경우, 사전 공지를 통해 변경 내용을
              고지하며, 변경된 방침은 웹사이트에 명시된 시행일부터 효력이
              발생합니다.
            </p>
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default PrivacyPolicyPage;

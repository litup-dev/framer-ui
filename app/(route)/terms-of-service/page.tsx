"use client";

import FadeIn from "@/components/shared/fade-in";

const TermsOfServicePage = () => {
  return (
    <FadeIn>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">이용약관</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-gray-700">
          <h2 className="text-xl font-semibold mb-4">이용약관</h2>

          <section>
            <h3 className="text-lg font-semibold mb-3">제1조 (목적)</h3>
            <p className="mb-4">
              이 약관은 본 서비스(이하 &quot;회사&quot; 또는
              &quot;플랫폼&quot;)가 제공하는 웹사이트 및 애플리케이션을 통해
              제공되는 모든 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여
              회사와 사용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을
              규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제2조 (용어의 정의)</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                &quot;이용자&quot;란 회사가 제공하는 서비스에 접속하여 이 약관에
                따라 회사가 제공하는 서비스를 이용하는 회원 및 비회원을
                말합니다.
              </li>
              <li>
                &quot;회원&quot;이란 서비스에 회원가입을 완료하고 지속적으로
                서비스를 이용할 수 있는 자를 의미합니다.
              </li>
              <li>
                &quot;콘텐츠&quot;란 이용자가 서비스 내에서 작성하거나 등록한
                정보(댓글, 게시글, 이미지, 리뷰 등)를 의미합니다.
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제3조 (서비스의 변경 및 중단)
            </h3>
            <p className="mb-4">
              회사는 서비스의 향상을 위하여 서비스의 내용, 구성, 화면, 기능 등을
              수정하거나 변경할 수 있으며, 이에 따른 변경 사항은 사전에
              공지합니다. 단, 긴급하거나 예기치 못한 상황에서는 사후에 공지할 수
              있습니다.
            </p>
            <p className="mb-4">
              회사는 다음 각 호의 사유로 인해 서비스의 전부 또는 일부를
              일시적으로 중단할 수 있으며, 이로 인한 손해에 대해서는 회사의 고의
              또는 중대한 과실이 없는 한 책임을 지지 않습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
              <li>시스템 점검, 보수, 교체 등 정기 또는 비정기 유지보수</li>
              <li>서비스 개선을 위한 기능 추가, 변경, 삭제</li>
              <li>정전, 서버 장애, 트래픽 폭주 등으로 인한 서비스 장애</li>
              <li>기타 천재지변, 비상사태 등 불가항력적인 사유</li>
            </ol>
            <p className="mb-4">
              회사는 다음의 경우 서비스의 전부 또는 일부를 종료할 수 있습니다.
              이 경우 최소 30일 이전에 사용자에게 고지하며, 고지 방법은 웹사이트
              내 공지 또는 이메일, 앱 알림 등을 통하여 진행합니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>경제적 사유 또는 경영상 필요(예: 운영 비용 문제)</li>
              <li>사용자 수의 급감 등으로 인한 서비스 지속의 어려움</li>
              <li>서비스 구조상, 기술상, 법령상 서비스 운영이 어려운 경우</li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제4조 (이용자 생성 콘텐츠의 저작권 및 운영 정책)
            </h3>
            <p className="mb-4">
              사용자가 서비스 내에서 작성하거나 업로드한 모든 콘텐츠(리뷰, 댓글,
              이미지, 기타 자료)의 저작권은 원칙적으로 해당 사용자에게
              귀속됩니다.
            </p>
            <p className="mb-4">
              사용자는 본인이 작성한 콘텐츠에 대해 회사가 다음과 같은 목적으로
              무상으로 이용할 수 있음에 동의합니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
              <li>서비스 홍보 및 마케팅 목적</li>
              <li>서비스 품질 향상을 위한 내부 분석</li>
              <li>
                플랫폼 외부 매체 및 제휴처에의 콘텐츠 활용
                <br />
                (단, 사용자의 닉네임 외 개인정보는 공개하지 않음)
              </li>
            </ol>
            <p className="mb-4">
              다음의 경우 회사는 별도의 사전 통지 없이 해당 콘텐츠를 수정, 차단,
              삭제할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
              <li>타인의 저작권 등 지적재산권을 침해한 경우</li>
              <li>
                명예훼손, 음란성, 허위사실, 범죄 목적의 내용이 포함된 경우
              </li>
              <li>관련 법령에 위반되거나 공공질서 및 미풍양속에 반하는 경우</li>
            </ol>
            <p>사용자 콘텐츠는 닉네임 기반의 익명 형태로 게시됩니다.</p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제5조 (금지행위)</h3>
            <p className="mb-4">
              이용자는 다음 각 호의 행위를 해서는 안 되며, 위반 시 회사는 사전
              고지 없이 조치를 취할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>
                불법적이거나 타인의 권리를 침해하는 콘텐츠의 업로드 및 공유
              </li>
              <li>저작권 또는 지적재산권을 위반하는 행위</li>
              <li>자동화된 프로그램(크롤러, 봇 등)을 이용한 서비스 접근</li>
              <li>시스템 해킹, 무단 접근, 보안 취약점 악용 등의 행위</li>
              <li>타 이용자에 대한 괴롭힘, 혐오 표현, 차별적 발언 등</li>
              <li>광고, 스팸성 콘텐츠, 리뷰 및 댓글 작성</li>
              <li>명백히 무의미하거나 중복된 콘텐츠 도배</li>
              <li>
                불필요한 정치적 발언 및 성차별적 성격을 띄는 발언 혹은 이 외의
                논쟁 유발성 행동
              </li>
            </ol>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제6조 (운영자의 권한 및 제재 기준)
            </h3>
            <p className="mb-4">
              명백한 약관 위반 행위에 대해서는 사전 고지 없이 관련 게시물을
              삭제하거나 계정을 제한할 수 있습니다.
            </p>
            <p className="mb-4">
              신고 기능을 통해 제3자가 문제를 제기할 수 있으며, 접수된 신고
              내용에 따라 운영자는 다음과 같은 조치를 취할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
              <li>경고 또는 콘텐츠 삭제</li>
              <li>일시적 또는 영구적인 계정 정지</li>
              <li>기타 운영자 판단에 따른 조치</li>
            </ol>
            <p>
              분쟁의 소지가 있는 게시물의 경우, 사실 확인을 위한 일정 기간 동안
              임시 비공개 또는 숨김 처리할 수 있습니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              제7조 (준거법 및 관할)
            </h3>
            <p className="mb-4">
              본 약관은 대한민국 법률에 따라 해석 및 적용됩니다.
            </p>
            <p>
              본 서비스와 관련하여 회사와 이용자 간에 분쟁이 발생한 경우, 회사의
              본사 소재지를 관할하는 법원을 제1심 관할 법원으로 합니다.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">제8조 (회원 탈퇴)</h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold mb-2">1. 회원 탈퇴 절차</p>
                <p className="ml-4">
                  회원은 언제든지 본인의 계정을 탈퇴할 수 있습니다. 탈퇴를 원할
                  경우, 회사가 제공하는 계정 설정 메뉴 또는 고객센터를 통해 탈퇴
                  신청을 할 수 있습니다.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">2. 탈퇴 요청 후 처리</p>
                <p className="ml-4">
                  탈퇴 요청이 접수되면, 회사는 사용자 계정에 대한 확인 절차를
                  거친 후, 탈퇴 처리 절차를 진행합니다. 탈퇴가 완료되면,
                  사용자의 모든 개인정보와 데이터를 즉시 삭제하며, 복구가
                  불가능하게 됩니다.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">3. 탈퇴 후의 영향</p>
                <p className="ml-4 mb-2">
                  회원 탈퇴 후에는 서비스 내에서 사용자가 생성한 모든 콘텐츠는
                  &quot;삭제된 사용자&quot;로 변경됩니다.
                </p>
                <ul className="list-disc list-inside ml-8">
                  <li>
                    탈퇴 후에도 일부 개인정보는 법적 의무(세금, 회계, 분쟁 해결
                    등)에 따라 최대 한 달동안 보관될 수 있습니다.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">4. 회사의 권한</p>
                <p className="ml-4">
                  회사는 아래와 같은 경우, 회원에게 별도의 사전 통지 없이 회원
                  자격을 정지하거나 탈퇴를 처리할 수 있습니다.
                </p>
                <ul className="list-disc list-inside ml-8 mt-2">
                  <li>본 약관을 위반한 경우</li>
                  <li>서비스 이용을 방해하거나 불법적 활동을 진행한 경우</li>
                  <li>기타 회사의 서비스 운영 방침에 위반되는 경우</li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </FadeIn>
  );
};

export default TermsOfServicePage;

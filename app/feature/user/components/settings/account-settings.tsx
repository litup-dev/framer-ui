const AccountSettings = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">계정 관리</h3>
      <div className="space-y-3">
        <button className="w-full text-left text-red-600 hover:text-red-800 text-sm">
          계정 삭제
        </button>
        <button className="w-full text-left text-red-600 hover:text-red-800 text-sm">
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default AccountSettings;

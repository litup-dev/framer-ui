const ProfileSettings = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">프로필</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">프로필 사진</span>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            변경
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">닉네임</span>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            수정
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">자기소개</span>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

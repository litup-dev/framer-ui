const AppSettings = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">앱 설정</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-700">다크 모드</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-700">언어</span>
          <select className="text-sm border border-gray-300 rounded px-2 py-1">
            <option>한국어</option>
            <option>English</option>
            <option>日本語</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;

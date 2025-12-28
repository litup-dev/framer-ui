interface Tab<T extends string> {
  value: T;
  label: string;
}

interface TabButtonProps<T extends string> {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export default function TabButton<T extends string>({
  tabs,
  activeTab,
  onChange,
}: TabButtonProps<T>) {
  return (
    <div className="h-[56px] md:h-[80px] bg-[#F5F5F5] rounded flex p-1 gap-1 md:p-1.5 md:gap-1.5 font-bold text-[14px] md:text-[16px] lg:text-[18px]">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 h-[48px] md:h-[68px] rounded flex items-center justify-center transition-colors ${
            activeTab === tab.value
              ? "bg-white text-black"
              : "bg-transparent text-[#202020]/40"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

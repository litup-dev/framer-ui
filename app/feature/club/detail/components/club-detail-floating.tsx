import Image from "next/image";
import { useState } from "react";

interface ClubDetailFloatingProps {
  onSelect?: (id: number) => void;
}

const floatingItems = [
  {
    id: 1,
    sectionId: "info",
    activeImage: "/images/club_info_active.svg",
    inactiveImage: "/images/club_info_inactive.svg",
    alt: "info",
  },
  {
    id: 2,
    sectionId: "schedule",
    activeImage: "/images/club_calendar_active.svg",
    inactiveImage: "/images/club_calendar_inactive.svg",
    alt: "calendar",
  },

  {
    id: 3,
    sectionId: "review",
    activeImage: "/images/club_review_active.svg",
    inactiveImage: "/images/club_review_inactive.svg",
    alt: "review",
  },
];

const ClubDetailFloating = ({ onSelect }: ClubDetailFloatingProps) => {
  const [activeItem, setActiveItem] = useState(0);

  const handleClick = (itemId: number, sectionId: string) => {
    setActiveItem(itemId);
    onSelect?.(itemId);

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="fixed bottom-10 right-5 flex flex-col gap-1 z-[1000000] xl:hidden">
      {floatingItems.map((item) => (
        <div key={item.id} className="cursor-pointer">
          <button onClick={() => handleClick(item.id, item.sectionId)}>
            <Image
              src={
                activeItem === item.id ? item.activeImage : item.inactiveImage
              }
              alt={item.alt}
              width={28}
              height={28}
              className="rounded-[3px]"
            />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ClubDetailFloating;

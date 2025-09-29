import Logo from "@/app/shared/components/logo";
import HeaderMenus from "@/app/shared/components/menus";

const Header = () => {
  return (
    <header className="py-5 px-10 flex justify-between">
      <Logo />
      <HeaderMenus />
    </header>
  );
};

export default Header;

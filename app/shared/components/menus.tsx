import Link from "next/link";

const HeaderMenus = () => {
  const MenuItems = [
    {
      id: 1,
      label: "Home",
      href: "/home",
    },
    {
      id: 2,
      label: "About",
      href: "/about",
    },
    {
      id: 3,
      label: "Contact",
      href: "/contact",
    },
    {
      id: 4,
      label: "Login",
      href: "/login",
    },
  ];
  return (
    <div className="flex gap-2">
      {MenuItems.map((item) => (
        <Link key={item.id} href={item.href}>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default HeaderMenus;

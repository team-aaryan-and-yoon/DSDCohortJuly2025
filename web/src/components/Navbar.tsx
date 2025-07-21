import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

interface Link {
  url: string;
  label: string;
}

interface NavbarProps {
  links: Link[];
  isLogged: boolean;
}

const Navbar = ({ links, isLogged }: NavbarProps) => {
  return (
    <NavigationMenu className="p-2 bg-gray-200 rounded-bl-md ">
      <NavigationMenuList className="gap-x-4">
        {links.map((link, key) => (
          <NavigationMenuItem key={key}>
            <NavigationMenuLink className="bg-blue-50" href={link.url}>
              {link.label}
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          {isLogged ? (
            <NavigationMenuLink className="bg-blue-50" href={"logout"}>
              Logout
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink className="bg-blue-50" href={"login"}>
              Login
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;

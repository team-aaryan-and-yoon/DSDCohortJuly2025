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
}

const Navbar = ({ links }: NavbarProps) => {
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
          {/* Need to check if user is logged in */}
          <NavigationMenuLink className="bg-blue-50" href={"login"}>
            Login
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { Link } from "@/Types";
import { useAuth } from "@/contexts/AuthContext";
import { Link as RouterLink } from "react-router-dom";



interface NavbarProps {
  links: Link[];
}

/**
 * Navbar component that renders a horizontal navigation menu.
 *
 * @component
 * @param {Array<{ url: string; label: string }>} links - An array of link objects containing the URL and label for each menu item.
 * @param {boolean} isLogged - A boolean indicating whether the user is logged in or not (overridden by auth context).
 *
 * @returns {JSX.Element} - A rendered navigation menu with the provided links and a login/logout item based on authentication status.
 */
const NavbarPages = ({ links }: NavbarProps) => {
  const { user, signOut } = useAuth();

  // Determine the correct portal URL - for now just go to customer portal
  const getPortalUrl = () => {
    if (!user) return '/sign-in';
    return '/customer-portal';
  };

  return (
    <NavigationMenu className="w-full p-2 rounded-lg justify-between">
      {/* Pages */}
      <NavigationMenuList className="w-full gap-x-4 ">
        {links.map((link, key) => {
          // Handle special routing logic
          let linkUrl = link.url;
          if (link.url === '/portal') {
            linkUrl = getPortalUrl();
          } else if (link.url === '/home') {
            linkUrl = '/';
          }
          return (
            <NavigationMenuItem key={key}>
              <NavigationMenuLink asChild className="hover:bg-white">
                <RouterLink to={linkUrl} className="text-xl text-gray-700 hover:text-blue-600 transition-colors">
                  {link.label}
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarPages;

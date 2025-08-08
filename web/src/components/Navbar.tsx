import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import type { Link } from "@/Types";
import { useAuth } from "@/contexts/AuthContext";
import { Link as RouterLink, useNavigate } from "react-router-dom";



interface NavbarProps {
  links: Link[];
  isLogged: boolean;
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
const Navbar = ({ links }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/sign-in');
  };

  // Determine the correct portal URL - for now just go to customer portal
  const getPortalUrl = () => {
    if (!user) return '/sign-in';
    return '/customer-portal';
  };

  return (
    <NavigationMenu className="p-2 bg-gray-200 rounded-b-md ">
      <NavigationMenuList className="gap-x-4">
        {links.map((link, key) => {
          // Handle special routing logic
          let linkUrl = link.url;
          if (link.url === '/portal') {
            linkUrl = getPortalUrl();
          } else if (link.url === '/home') {
            linkUrl = '/';
          } else if (link.url === '/account') {
            // For now, redirect account to customer portal
            linkUrl = '/customer-portal';
          }

          return (
            <NavigationMenuItem key={key}>
              <NavigationMenuLink asChild className="bg-blue-50">
                <RouterLink to={linkUrl}>
                  {link.label}
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
        <NavigationMenuItem>
          {user ? (
            <NavigationMenuLink 
              className="bg-blue-50 cursor-pointer" 
              onClick={handleLogout}
            >
              Logout ({user.first_name})
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink asChild className="bg-blue-50">
              <RouterLink to="/sign-in">
                Login
              </RouterLink>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;

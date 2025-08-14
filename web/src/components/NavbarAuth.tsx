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
const NavbarAuth = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/sign-in");
  };

  // Determine the correct portal URL - for now just go to customer portal
  const getPortalUrl = () => {
    if (!user) return "/sign-in";
    return "/customer-portal";
  };

  return (
    <NavigationMenu>
      <NavigationMenuList className="px-2 flex items-center gap-2">
        {/* Logins/sign ups */}
        <NavigationMenuItem className="items-center">
          {user ? (
            <NavigationMenuLink
              className="bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-md cursor-pointer block min-w-[140px] text-center whitespace-nowrap"
              onClick={handleLogout}>
              Sign Out ({user.first_name})
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink asChild className="hover:bg-white">
              <RouterLink
                to="/sign-in"
                className="text-lg px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 transition-colors block min-w-[80px] text-center whitespace-nowrap">
                Sign In
              </RouterLink>
            </NavigationMenuLink>
          )}
        </NavigationMenuItem>
        {!user && (
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-md block min-w-[110px] text-center">
              <RouterLink
                to="/sign-up"
                className="text-lg text-white whitespace-nowrap">
                Get Started
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default NavbarAuth;

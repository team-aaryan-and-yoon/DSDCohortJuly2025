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
    navigate('/sign-in');
  };

  // Determine the correct portal URL - for now just go to customer portal
  const getPortalUrl = () => {
    if (!user) return '/sign-in';
    return '/customer-portal';
  };

  return (
    <NavigationMenu>
        <NavigationMenuList className="px-4">
      {/* Logins/sign ups */} 
          <NavigationMenuItem className="items-center">
          {user ? (
            <NavigationMenuLink 
              className="bg-blue-50 cursor-pointer" 
              onClick={handleLogout}
            >
              Sign Out   ({user.first_name})
            </NavigationMenuLink>
          ) : (
            <NavigationMenuLink asChild  className="hover:bg-white">
              <RouterLink to="/sign-in" className="text-lg text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </RouterLink>
            </NavigationMenuLink> 
          ) }
        </NavigationMenuItem>
        {!user && 
        <NavigationMenuItem className="px-4">
            <NavigationMenuLink asChild className="bg-blue-600 hover:bg-blue-700">
              <RouterLink to="/sign-up" className="text-lg text-white hover:bg-accent hover:text-white dark:hover:bg-accent/50 ">
                Get Started
              </RouterLink>
            </NavigationMenuLink> 
        </NavigationMenuItem>
            }
      </NavigationMenuList>


    </NavigationMenu>
  );
};

export default NavbarAuth;

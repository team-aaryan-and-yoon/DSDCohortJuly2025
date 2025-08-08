import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/utils/supabaseClient';
import { apiClient } from '@/utils/apiClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error);
          navigate('/sign-in');
          return;
        }

        if (session?.user) {
          console.log('OAuth successful, user:', session.user);
          
          // Check if profile exists
          let profileExists = false;
          try {
            const profileResponse = await apiClient.get(`/profiles/?supabase_id=${session.user.id}`);
            console.log('Profile check response:', profileResponse.data);
            
            // Check if profile actually exists and has required fields
            if (profileResponse.data && profileResponse.data.user_num) {
              profileExists = true;
            }
          } catch (profileError) {
            console.log('Profile does not exist yet');
          }
          
          if (!profileExists) {
            // For Google OAuth users without a profile, redirect to signup page to complete profile
            // Store the OAuth data in sessionStorage for the signup page
            sessionStorage.setItem('oauthUser', JSON.stringify({
              supabase_id: session.user.id,
              email: session.user.email,
              full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
              avatar_url: session.user.user_metadata?.avatar_url || '',
              isGoogleAuth: true
            }));
            
            console.log('Redirecting to signup for profile completion');
            navigate('/sign-up?complete=true');
          } else {
            // Profile exists, go to customer portal
            navigate('/customer-portal');
          }
        } else {
          navigate('/sign-in');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/sign-in');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
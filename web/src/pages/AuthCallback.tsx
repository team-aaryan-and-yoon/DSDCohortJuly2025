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
          // Auth callback error - redirect to sign in
          navigate('/sign-in');
          return;
        }

        if (session?.user) {
          // OAuth successful
          
          // Check if profile exists
          let profileExists = false;
          try {
            const profileResponse = await apiClient.get('/profiles/');
            
            // Status 204 means authenticated but no profile
            // Any other 2xx status means profile exists
            if (profileResponse.status === 200 && profileResponse.data?.user_num) {
              profileExists = true;
            }
          } catch (profileError: any) {
            // 204 is returned as an error by axios sometimes
            if (profileError?.response?.status === 204) {
              // Profile does not exist yet
              profileExists = false;
            } else {
              // Error checking profile - continue anyway
            }
          }
          
          if (!profileExists) {
            // For Google OAuth users without a profile, redirect to signup page to complete profile
            if (session.user.app_metadata?.provider === 'google') {
              sessionStorage.setItem('oauthUser', JSON.stringify({
                supabase_id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                avatar_url: session.user.user_metadata?.avatar_url || '',
                isGoogleAuth: true
              }));
              
              // Preserve the pending redirect during profile completion
              // The SignUp page will handle it after profile is created
              
              // Redirect to signup for profile completion
              navigate('/sign-up?complete=true');
            } else {
              // Regular email user without profile - shouldn't happen with new flow
              // but go to home anyway
              navigate('/');
            }
          } else {
            // Profile exists, check for pending redirect
            const redirectPath = sessionStorage.getItem('redirectAfterAuth');
            const pendingService = sessionStorage.getItem('pendingService');
            
            if (redirectPath && pendingService) {
              // Clear the stored redirect path
              sessionStorage.removeItem('redirectAfterAuth');
              const service = JSON.parse(pendingService);
              // Navigate back to book-service with the service data
              navigate(redirectPath, { state: { service }, replace: true });
            } else {
              // No pending redirect, go to home
              navigate('/');
            }
          }
        } else {
          navigate('/sign-in');
        }
      } catch (error) {
        // Unexpected error - redirect to sign in
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
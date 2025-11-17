import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const LoginDirect = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('access');
    const refreshToken = searchParams.get('refresh');
    const userDataStr = searchParams.get('user');

    if (accessToken) localStorage.setItem('access_token', accessToken);
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
    if (userDataStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userDataStr));
        localStorage.setItem('user', JSON.stringify(user));
      } catch (err) {
        console.error('Failed to parse user data', err);
      }
    }

    // Redirect sang dashboard hoặc route chính
    navigate("/", { replace: true });
  }, [navigate, searchParams]);

  return <div>Redirecting...</div>;
};

export default LoginDirect;

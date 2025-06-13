// hooks/useCheckResetToken.js
import { useEffect } from 'react';

const useCheckResetToken = (token: string) => {
  useEffect(() => {
    const checkResetToken = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/auth/cek-reset-token`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });
        const res = await response.json();
        if (res.message === 'token tidak tersedia') {
            window.location.href = '/login'
        }
        // Lakukan tindakan lain berdasarkan respons (misalnya, kembalikan status validitas token)
      } catch (error) {
        console.error("Error checking reset token:", error);
        // Tangani error (misalnya, kembalikan status error)
      }
    };

    if (token) {
      checkResetToken();
    }
  }, [token]);

  // Anda bisa mengembalikan nilai atau fungsi lain dari custom Hook jika diperlukan
  return null; // Atau mungkin status loading/error/validitas
};

export default useCheckResetToken;
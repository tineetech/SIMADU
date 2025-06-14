const checkIsLogin = async (): Promise<boolean> => {
  const token = localStorage.getItem('authToken') ?? '';
  if (!token) {
    console.warn('Token tidak ditemukan di localStorage');
    return false;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Handle different HTTP status codes for more specific error handling
      if (response.status === 401) {
        console.warn('Token tidak valid atau telah kedaluwarsa');
        localStorage.removeItem('authToken');
        localStorage.removeItem('resetToken');
        window.location.href = "/login"; // Redirect ke halaman login
        return false;
      } else if (response.status === 404) {
        console.warn('Endpoint /api/auth/me tidak ditemukan');
        return false;
      } else {
        console.error(`Error dari backend (Status: ${response.status}): ${response.statusText}`);
        return false; // Hindari redirect untuk error server lainnya.
      }
    }

    const data = await response.json();
    
    if (data) {
      return true; // Token valid, dan backend mengembalikan success:true
    }
     else {
        console.warn('Token tidak valid: ', data);
        localStorage.removeItem('authToken');
        localStorage.removeItem('resetToken');
        window.location.href = "/login";
        return false;
     }

  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.error("Error koneksi ke server:", error);
        return false; //fetch error
    }
    console.error("Error saat memeriksa token:", error);
    return false;
  }
};

export default checkIsLogin;

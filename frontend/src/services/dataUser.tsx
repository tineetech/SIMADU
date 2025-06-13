import { useEffect, useState } from "react";

export interface UserData {
    first_name?: string;
    last_name?: string;
    username?: string;
    email?: string;
    user_id?: number;
    koin?: number;
    amount?: number;
    created_at?: number;
    id?: number;
    avatar?: string;
    // properti lain
  }

const DataUser = () => {
  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('authToken') ?? '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (token === '') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.json() || `Gagal mendapatkan data: Status ${response.status}`;
          
          console.log(errorMessage)
        } else {
          const resData = await response.json();
          setData(resData.results ? resData.results : resData); // Menangani jika 'results' tidak ada
        }
      } catch (e) {
        console.error("Error fetching user data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]); // Hanya jalankan fetch jika token berubah

  return { data, loading };
};

export default DataUser;
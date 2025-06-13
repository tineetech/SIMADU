import { useEffect, useState } from "react";

export interface Users {
    data: {
        length?: number;
        user_id?: number;
        id?: number;
        username?: string;
        first_name?: string;
        last_name?: string;
        avatar?: string;
        email?: string;
        phone?: string;
        role?: string;
        status?: string;
    }
    // properti lain
}

const GetUsersData = () => {
  const [data, setData] = useState<Users | null>(null);
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
        const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/users/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.json() || `Gagal mendapatkan data: Status ${response.status}`;
          
          console.log(errorMessage)
        } else {
          const resData = await response.json();
          setData(resData.results ? resData.results[0] : resData); // Menangani jika 'results' tidak ada
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

export default GetUsersData;
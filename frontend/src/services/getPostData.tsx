import { useEffect, useState } from "react";

export interface Post {
    data: {
        length?: number;
        user_id?: number;
        id?: number;
        type?: string;
        content?: string;
        status?: string;
    }
    // properti lain
}

const GetPostData = () => {
  const [data, setData] = useState<Post | null>(null);
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/`, {
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

export default GetPostData;
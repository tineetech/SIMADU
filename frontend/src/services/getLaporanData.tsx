import { useEffect, useState } from "react";

export interface Laporan {
    data: {
        map: any;
        length?: number;
        user_id?: number;
        id?: number;
        image?: string;
        location_latitude?: string;
        location_longitude?: string;
        description?: string;
        event_date?: string;
        category?: string;
        type_verification?: string;
        status?: string;
        notes?: string;
    }
    // properti lain
}

const GetLaporanData = () => {
  const [data, setData] = useState<Laporan | null>(null);
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lapor/`, {
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

export default GetLaporanData;
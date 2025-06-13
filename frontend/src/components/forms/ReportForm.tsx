import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import axios from 'axios';


// Atasi masalah icon default Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import DataUser from '../../services/dataUser';
import Swal from 'sweetalert2';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


export default function ReportForm() {
    const initialPosition: LatLngExpression = [-6.595, 106.81664];
    const [markerPosition, setMarkerPosition] = useState<LatLngExpression | null>(null);
    const [clickedLatLng, setClickedLatLng] = useState<{ lat: number | null; lng: number | null }>({ lat: null, lng: null });
    const [address, setAddress] = useState<string | null>(null);
    const [uploadFile1, setUploadFile1] = useState<File | null>(null);
    const [jenisMasalah, setJenisMasalah] = useState<string>('');
    const [estimasiWaktu, setEstimasiWaktu] = useState<string>('');
    const [deskripsi, setDeskripsi] = useState<string>('');
    const [isClickVerifAi, setIsClickVerifAi] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [message, setMessage] = useState<string>('Memulai Analisis...');
    const dataUser = DataUser()
    const token = localStorage.getItem('authToken') ?? '';

    function MapEvents() {
        useMapEvents({
            click: async (e) => {
                setMarkerPosition(e.latlng);
                setClickedLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
                console.log('Latitude:', e.latlng.lat, 'Longitude:', e.latlng.lng);

                try {
                    const response = await axios.get(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`
                    );
                    if (response.data && response.data.address) {
                        const road = response.data.address.road || response.data.address.pedestrian || response.data.address.footway || 'Alamat tidak ditemukan';
                        const village = response.data.address.village ? `, ${response.data.address.village}` : '';
                        const city = response.data.address.city ? `, ${response.data.address.city}` : '';
                        const county = response.data.address.county ? `, ${response.data.address.county}` : '';

                        setAddress(`${road}${village}${city}${county}`);
                    } else {
                        setAddress('Alamat tidak ditemukan');
                    }
                } catch (error) {
                    console.error('Error fetching address:', error);
                    setAddress('Gagal mendapatkan alamat');
                }
            },
        });
        return null;
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setUploadFile1(event.target.files[0]);
        }
    };

    const handleJenisMasalahChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setJenisMasalah(event.target.value);
    };

    const handleEstimasiWaktuChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEstimasiWaktu(event.target.value);
    };

    const handleDeskripsiChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDeskripsi(event.target.value);
    };

    const handleSubmitAi = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!uploadFile1) {
            alert('Harap unggah foto laporan.');
            return;
        }

        setIsClickVerifAi(true)
        setTimeout(() => {
            setProgress(10)
            setMessage("Menggunggah Foto..")
        }, 2000);
        
        try {
            const resAi = await analyzeAi()
            setProgress(70)
            setMessage('Menganalisa kesimpulan..')
            console.log(resAi)
            if (!resAi) {
                console.log("gagal analisis tidak ada hasil :", resAi)
            }
            
            if (resAi?.res?.includes('YA')) {
                setProgress(100)
                setMessage('Analisa berhasil, gambar tersebut terverifikasi sebagai laporan bencana alam atau kerusakan.')
                
                const formData = new FormData();
                formData.append('user_id', dataUser?.data?.user_id?.toString() ?? '');
                formData.append('file', uploadFile1);
                formData.append('location_lat', clickedLatLng.lat?.toString() ?? '');
                formData.append('location_long', clickedLatLng.lng?.toString() ?? '');
                formData.append('event_date', estimasiWaktu ?? '');
                formData.append('category', jenisMasalah);
                formData.append('description', deskripsi);
                formData.append('isVerifyWithAi', 'true');
                formData.append('urlImage', resAi?.image ?? '');
                formData.append('type_verification', 'manual'); // Atau sesuai kebutuhan
                formData.append('status', 'pending'); // Atau status default lainnya
                formData.append('notes', ''); // Atau nilai default lainnya
                
                try {
                const response = await fetch(`${import.meta.env.VITE_LAPOR_SERVICE}/api/lapor/create`, {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    body: formData, // Gunakan formData sebagai body
                });
                
                const responseData = await response.json();

                if (response.ok) {
                    createPostWhenFinishReport()
                    Swal.fire({
                        title: "Laporan berhasil!",
                        text: `Laporan id #${responseData.data.insertId ?? ''} anda sudah dikirim, anda mendapat reward 50 koin.`,
                        icon: "success",
                    }).then((res) => {
                        if (res.isConfirmed) {
                            location.reload()
                        }
                    });
                } else {
                    alert(`Gagal mengirim laporan: ${responseData?.message || response.statusText}`);
                }
                } catch (error) {
                console.error('Error sending report:', error);
                alert('Terjadi kesalahan saat mengirim laporan.');
                }
            } else if (resAi?.res?.includes("TIDAK")) {
                setProgress(100)
                setMessage('Analisa berhasil, gambar tersebut tidak terverifikasi sebagai laporan bencana alam atau kerusakan.')
            }
        } catch (e) {
            console.error(e)
        }
    }
    
    const analyzeAi = async () => {
        
        if (!uploadFile1) {
            alert('Harap unggah foto laporan.');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', uploadFile1);

        try {
            const res = await fetch(`${import.meta.env.VITE_LAPOR_SERVICE}/api/lapor/analisis-ai`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            console.log(res)
            const data = await res.json()
            if (data) {
                setProgress(40)
                setMessage('Mengambil respon..')
                return {
                    res: data.data.candidates[0].content.parts[0].text,
                    image: data.image
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    const createPostWhenFinishReport = async () => {
        
        if (!uploadFile1) {
            alert('Harap unggah foto laporan.');
            return;
        }
        
        const formData = new FormData();
        formData.append('type', 'image');
        formData.append('image', uploadFile1);
        formData.append('content', deskripsi);

        try {
            const res = await fetch(`${import.meta.env.VITE_POST_SERVICE}/api/postingan/create`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()
            if (data) {
                setProgress(80)
                setMessage('Membuat postingan dari laporan..')
                return
            }

        } catch (e) {
            console.error(e)
        }
    }

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!uploadFile1) {
            alert('Harap unggah foto laporan.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', dataUser?.data?.user_id?.toString() ?? '');
        formData.append('file', uploadFile1);
        formData.append('location_lat', clickedLatLng.lat?.toString() ?? '');
        formData.append('location_long', clickedLatLng.lng?.toString() ?? '');
        formData.append('event_date', estimasiWaktu ?? '');
        formData.append('category', jenisMasalah);
        formData.append('description', deskripsi);
        formData.append('type_verification', 'manual'); // Atau sesuai kebutuhan
        formData.append('status', 'pending'); // Atau status default lainnya
        formData.append('notes', ''); // Atau nilai default lainnya
        
        try {
        const response = await fetch(`${import.meta.env.VITE_LAPOR_SERVICE}/api/lapor/create`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData, // Gunakan formData sebagai body
        });
        
        const responseData = await response.json();

        if (response.ok) {
            createPostWhenFinishReport()
            Swal.fire({
                title: "Laporan berhasil!",
                text: `Laporan id #${responseData.data.insertId ?? ''} anda sudah dikirim, mohon menunggu untuk verifikasi laporan tersebut.`,
                icon: "success",
            }).then((res) => {
                if (res.isConfirmed) {
                    location.reload()
                }
            });
        } else {
        alert(`Gagal mengirim laporan: ${responseData?.message || response.statusText}`);
        }
        } catch (error) {
        console.error('Error sending report:', error);
        alert('Terjadi kesalahan saat mengirim laporan.');
        }
      };
      

    return (
        <div className="relative z-10 -mt-40 px-4 pb-20">
            <div className="bg-tertiary dark:bg-tertiaryDark rounded-2xl shadow-xl max-w-4xl mx-auto p-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Upload Foto</label>
                        <label htmlFor="uploadFile1" className="bg-white text-slate-500 w-full font-semibold text-base rounded-lg mt-3 h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto">
                            {
                                uploadFile1 ? (
                                    <div className='flex flex-col items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-3 fill-gray-500" viewBox="0 0 32 32">
                                            <path
                                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                                data-original="#000000" />
                                            <path
                                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                                data-original="#000000" />
                                        </svg>
                                        1 File DiUpload
                                        <p className="text-xs font-medium text-slate-400 mt-2">{uploadFile1.name}</p>
                                    </div>
                                ) : (
                                    <div className=' flex flex-col items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-11 mb-3 fill-gray-500" viewBox="0 0 32 32">
                                            <path
                                                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                                                data-original="#000000" />
                                            <path
                                                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                                                data-original="#000000" />
                                        </svg>
                                        Upload file
                                        <p className="text-xs font-medium text-slate-400 mt-2">PNG, JPG SVG, WEBP, and GIF are Allowed.</p>
                                    </div>
                                )
                            }

                            <input type="file" id='uploadFile1' accept="image/*" className="hidden" onChange={handleFileChange} />
                        </label>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Lokasi Masalah</label>
                        <div className="w-full overflow-hidden h-[300px]">
                            <MapContainer center={initialPosition} zoom={13} style={{ height: '400px', width: '100%' }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapEvents />
                                {markerPosition && (
                                    <Marker position={markerPosition}>
                                        <Popup>
                                            {address ? (
                                                <div>
                                                    Nama Jalan: {address} <br />
                                                    Latitude: {clickedLatLng.lat?.toFixed(5)} <br />
                                                    Longitude: {clickedLatLng.lng?.toFixed(5)}
                                                </div>
                                            ) : (
                                                'Mencari alamat...'
                                            )}
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Jenis Masalah</label>
                        <select className="w-full border border-gray-300 rounded-md p-2" value={jenisMasalah} onChange={handleJenisMasalahChange}>
                            <option value="">Pilih Jenis Masalah</option>
                            <option value="jalan_rusak">Jalan rusak</option>
                            <option value="sampah_menumpuk">Sampah menumpuk</option>
                            <option value="pju_mati">PJU mati</option>
                            <option value="banjir">Banjir</option>
                            <option value="lainnya">Lainnya</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Estimasi Waktu Terjadi</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2"
                            value={estimasiWaktu}
                            onChange={handleEstimasiWaktuChange}
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Deskripsi</label>
                        <textarea
                            className="w-full border border-gray-300 rounded-md p-2 h-28"
                            placeholder="Jelaskan masalah secara detail..."
                            value={deskripsi}
                            onChange={handleDeskripsiChange}
                        ></textarea>
                    </div>
                    <div className="md:col-span-2 text-center">
                        <div className='py-3 gap-2 flex items-center justify-center'>
                            <hr className='text-gray-300 w-[40%]' />
                            <span className=''>Kirim Laporan</span>
                            <hr className='text-gray-300 w-[40%]' />
                        </div>
                        <div className='flex gap-2 mt-2'>
                            <div className='flex flex-col w-1/2'>
                                <button
                                    type="button"
                                    onClick={(e) => handleSubmitAi(e)}
                                    className="bg-transparent border-primary border-2 text-primary font-bold px-6 py-4 rounded-md hover:bg-primary hover:text-white hover:cursor-pointer transition"
                                >
                                    Verifikasi Dengan Ai
                                </button>
                                <span className='mt-2 text-gray-400'>Verifikasi Lebih cepat</span>
                            </div>
                            <div className='flex flex-col w-1/2'>
                                <button
                                    type="submit"
                                    className="bg-primary dark:bg-accentDark text-textDark font-bold px-6 py-4 rounded-md hover:bg-blue-900 hover:cursor-pointer transition"
                                    >
                                    Normal Verifikasi
                                </button>
                                <span className='mt-2 text-gray-400'>Biasanya Menunggu 1-2 Hari untuk verifikasi.</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* popup */}
            {
                isClickVerifAi && (
                    <div className='fixed flex justify-center items-center top-0 start-0 w-full h-screen' style={{background: "rgba(0,0,0,.5)", zIndex: '9999999'}}>
                        <div className='w-[400px] px-5 text-center h-auto py-10 bg-white dark:bg-gray-700 rounded-2xl'>
                            <h1 className='font-semibold'>Proses Verifikasi</h1>
                            <p className='text-sm text-gray-400'>Sabar ya, SikuyAi Lagi Analisis Foto Yang Kamu Kirim.</p>
                            
                            {/* Progress Bar */}
                            <div className='w-full mt-10 bg-gray-200 rounded-full h-5'>
                                <div
                                    className='bg-green-500 h-5 rounded-full transition-all ease-in-out'
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className='text-sm text-gray-400 mt-3'>{message}</p>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
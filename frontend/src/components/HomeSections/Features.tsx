import { Camera, FileInput, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

export default function Features () {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const root = window.document.documentElement;
        const darkMode = root.classList.contains("dark");
        setIsDark(darkMode);

        const observer = new MutationObserver(() => {
            setIsDark(root.classList.contains("dark"));
        });

        observer.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    return (
        <main className="container mx-auto px-6">
            {/* Bagian Laporan Masalah */}
            <section className="bg-blue-100 dark:bg-tertiaryDark p-10 md:p-15 rounded-4xl">
                <div className="mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        Laporan Masalah Kota yang Lebih Mudah
                    </h2>
                    <p className="text-textBody dark:text-textBodyDark mt-4">
                        simadu mempermudah warga dalam melaporkan masalah sekitar
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-18 pb-10 md:pb-0 md:gap-8 mx-auto">
                    <div className="bg-primary dark:bg-gray-700 rounded-3xl shadow-xl p-6 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow">
                            Ambil Foto
                        </div>
                        <img src="/images/foto-masalah.png" alt="Foto Masalah" className="rounded-2xl w-full dark:border-gray-800 shadow-md object-cover" />
                        <div className="absolute whitespace-nowrap -bottom-4 left-1/2 -translate-x-1/2 bg-background dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-xl">
                            <div className="flex items-center gap-1">
                                <Camera />
                                Dokumentasikan Masalahmu
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary dark:bg-gray-700 rounded-3xl shadow-xl p-6 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow">
                            Tandai Lokasi
                        </div>
                        <img
                            src={isDark ? "/images/map(Nights).png" : "/images/map(Standard).png"}
                            alt="Foto Masalah"
                            className="rounded-2xl w-full dark:border-gray-800 shadow-md object-cover"
                        />
                        <div className="absolute whitespace-nowrap -bottom-4 left-1/2 -translate-x-1/2 bg-background dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-xl">
                            <div className="flex items-center gap-1">
                                <MapPin />
                                Pilih Titik Lokasi Kejadian
                            </div>
                        </div>
                    </div>
                    <div className="bg-primary dark:bg-gray-700 rounded-3xl shadow-xl p-6 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow">
                            Kirim Laporan
                        </div>
                        <img src="/images/foto-masalah2.png" alt="Foto Masalah" className="rounded-2xl w-full dark:border-gray-800 shadow-md object-cover" />
                        <div className="absolute whitespace-nowrap -bottom-4 left-1/2 -translate-x-1/2 bg-background dark:bg-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-xl">
                            <div className="flex items-center gap-1">
                                <FileInput />
                                Isi Data Secara Lengkap & Kirim
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};


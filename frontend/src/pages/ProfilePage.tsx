/* eslint-disable */
import { useEffect, useState } from "react";
import { Coins, FileText, GalleryHorizontal, Plus, Repeat } from "lucide-react";
import PostItem from "../components/PostItem";
import ReportList from "../components/ReportList";
import { PostInterface, Report } from "../types";
import NotificationsHistory from "../components/NotificationsHistory";
import { Link } from "react-router-dom";
import DataUser from "../services/dataUser";

export default function ProfilePage() {
    const datas = DataUser();
    const [activeTab, setActiveTab] = useState("report");
    const tabs = [
        { key: "report", label: "Laporan" },
        { key: "post", label: "Postingan" },
    ];

    const dummyUser = {
        firstName: datas?.data?.first_name ?? '',
        lastName: datas?.data?.last_name ?? '',
        username: datas?.data?.username ?? '',
        joinedAt: datas.data?.created_at ?? '',
        coin: datas?.data?.amount ?? 0,
        avatar: datas.data?.avatar ?? '',
        email: datas.data?.email
    };

    const isoDate = dummyUser.joinedAt;
    const date = new Date(isoDate);
    const options: any = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString('id-ID', options);

    const [dummyReports, setDummyReports] = useState<Report[]>([])
    const [dummyPosts, setDummyPosts] = useState<PostInterface[]>([])

    // State untuk loading UI, inisialisasi true karena data akan mulai diambil saat komponen mount
    const [isLoadingReports, setIsLoadingReports] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);

    const token = localStorage.getItem('authToken') ?? '';

    useEffect(() => {
        // Debugging logs untuk datas
        // console.log("useEffect triggered. Current datas:", datas);
        // console.log("User ID from datas:", datas?.data?.user_id);

        // Conditional fetching berdasarkan ketersediaan 'datas'
        if (datas && datas.data && datas.data.user_id) {
            // console.log("User data found, fetching reports and posts...");
            fetchReports();
            fetchPosts();
        }
        // Jika 'datas' awalnya null/undefined (sebelum DataUser hook memberikan nilai),
        // state isLoading akan tetap true, menampilkan spinner.
        // Setelah DataUser hook menyelesaikan dan 'datas' diupdate, useEffect ini akan berjalan kembali.
    }, [datas]); // Dependency array: jalankan kembali efek ketika 'datas' berubah

    const fetchReports = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/lapor/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            // Tambahkan penanganan error untuk response non-OK
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch reports: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
            }

            const dataReports = await response.json();
            // console.log("Fetched Reports data:", dataReports); // Untuk debugging

            // Pastikan dataReports.data adalah array sebelum memfilter
            if (!dataReports.data || !Array.isArray(dataReports.data)) {
                console.warn("dataReports.data is not an array or is missing for reports.");
                setDummyReports([]); // Atur ke kosong jika data tidak valid
                return; // Keluar lebih awal
            }

            // Filter laporan berdasarkan user_id dari data pengguna yang sedang login
            // Gunakan 'datas?.data?.user_id' dengan aman di sini karena useEffect memastikan 'datas' siap sebelum memanggil ini.
            const formattedReports: Report[] = dataReports.data
                .filter((item: any) => item.user_id === datas.data?.user_id)
                .map((item: any) => ({
                    id: item.id,
                    title: "Laporan Warga",
                    image: item.image ?? '',
                    description: item.description.substring(0, 30) + (item.description.length > 30 ? '...' : ''),
                    status: item.status === 'success' ? 'Sukses' : 'Diproses',
                    submittedAt: item.updated_at.substring(0, 10)
                }));
            setDummyReports(formattedReports);
            // console.log("Formatted Reports:", formattedReports); // Debugging formatted data
        } catch(e) {
            console.error("Error fetching reports:", e);
            setDummyReports([]); // Pastikan state kosong jika ada error
        } finally {
            setIsLoadingReports(false); // Set loading ke false setelah fetch selesai (berhasil/gagal)
        }
    };

    const fetchPosts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            // Tambahkan penanganan error untuk response non-OK
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText} - ${errorData.message || ''}`);
            }

            const dataPosts = await response.json();
            // console.log("Fetched Posts data:", dataPosts); // Untuk debugging

            // Pastikan dataPosts.data ada dan merupakan array
            if (!dataPosts.data || !Array.isArray(dataPosts.data)) {
                console.warn("dataPosts.data is not an array or is missing for posts.");
                setDummyPosts([]);
                return; // Keluar lebih awal
            }

            // Memetakan data dari API ke format PostInterface
            const formattedPosts: PostInterface[] = dataPosts.data
                .filter((item: any) => item.user_id === datas.data?.user_id) // Filter postingan berdasarkan user_id
                .map((item: any) => ({
                    id: item.id,
                    user_id: item.user_id,
                    username: item.user?.username ?? 'Anonim', // Akses username dari nested user object
                    avatar: item.user?.avatar ?? '/images/default-avatar.jpg', // Akses avatar dari nested user object
                    image: item.image ?? '', // Langsung dari properti 'image' di root post object
                    content: item.content,
                    type: item.type,
                    users: { // Struktur users sesuai dengan PostInterface dummy sebelumnya
                        user_id: item.user_id,
                        username: item.user?.username ?? 'Anonim'
                    },
                    created_at: new Intl.DateTimeFormat('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    }).format(new Date(item.created_at)),
                    likes: item.like_count ?? 0,
                    comment_count: item.comment_count ?? 0,
                    like_count: item.like_count ?? 0, // Duplikasi untuk mencocokkan PostInterface
                    comments: item.comments ?? [] // Pastikan comments adalah array
                }));
            setDummyPosts(formattedPosts); // Set state sekali dengan array yang sudah diformat
            // console.log("Formatted Posts:", formattedPosts); // Debugging formatted data
        } catch(e) {
            console.error("Error fetching posts:", e);
            setDummyPosts([]); // Pastikan state kosong jika ada error
        } finally {
            setIsLoadingPosts(false); // Set loading ke false setelah fetch selesai (berhasil/gagal)
        }
    };

    return (
        <div className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            {/* Cover */}
            <div className="bg-lapor py-28 pb-46 relative" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mx-auto container px-4 md:px-0 pb-8 min-h-screen">

                {/* Profile Information */}
                <aside className="col-span-12 md:col-span-4 lg:col-span-3 -mt-24 relative z-10 order-1 md:order-none">
                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-6 md:p-8">
                        <img
                            src={dummyUser.avatar}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover mx-auto"
                        />
                        <div className="flex flex-col items-center mt-4">
                            <h1 className="text-xl font-semibold">{dummyUser.firstName} {dummyUser.lastName}</h1>
                            <h2 className="text-textBody dark:text-textBodyDark">@{dummyUser.username}</h2>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* COIN */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Coins className="text-yellow-500" />
                                    <div>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">Coin</p>
                                        <p className="text-xl font-medium">{dummyUser.coin}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/tukar-coin"
                                    className="p-2 rounded-md bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition"
                                    title="Tukar Coin"
                                >
                                    <Repeat size={18} />
                                </Link>
                            </div>

                            {/* LAPORAN */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-blue-500" />
                                    <div>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">Total Laporan</p>
                                        <p className="text-xl font-medium">{dummyReports.length}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/lapor"
                                    className="p-2 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                    title="Buat Laporan"
                                >
                                    <Plus size={18} />
                                </Link>
                            </div>

                            {/* POSTINGAN */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <GalleryHorizontal className="text-green-500" />
                                    <div>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">Total Postingan</p>
                                        <p className="text-xl font-medium">{dummyPosts.length}</p>
                                    </div>
                                </div>
                                <Link
                                    to="/komunitas"
                                    className="p-2 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition"
                                    title="Buat Postingan"
                                >
                                    <Plus size={18} />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 space-y-2 text-sm text-textBody dark:text-textBodyDark text-center">
                            <p>Bergabung pada {formattedDate}</p>
                            <p>{dummyUser.email}</p>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <div className="col-span-12 md:col-span-8 lg:col-span-9 order-2 mt-4">
                    {/* Tabs */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        {tabs.map((t) => (
                            <button
                                key={t.key}
                                onClick={() => setActiveTab(t.key)}
                                className={`font-medium text-base ${activeTab === t.key
                                    ? "text-text dark:text-textDark"
                                    : "text-textBody dark:text-textBodyDark hover:text-text dark:hover:text-textDark"
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Content and Notification */}
                    <div className="grid grid-cols-1 lg:grid-cols-9 gap-6">
                        <main className="col-span-1 lg:col-span-6 space-y-4">
                            {activeTab === "report" ? (
                                // Conditional rendering for Reports
                                isLoadingReports ? (
                                    <div className="flex flex-col items-center justify-center h-40 bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                                        <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-3 text-textBody dark:text-textBodyDark">Memuat laporan...</p>
                                    </div>
                                ) : dummyReports.length === 0 ? (
                                    <div className="flex items-center justify-center h-40 bg-tertiary dark:bg-tertiaryDark rounded-md shadow text-textBody dark:text-textBodyDark p-4">
                                        Tidak ada laporan yang tersedia.
                                    </div>
                                ) : (
                                    dummyReports.map((report, index) => (
                                        <ReportList
                                            key={report.id}
                                            report={report}
                                            index={index}
                                            hideDetailButton={true}
                                        />
                                    ))
                                )
                            ) : (
                                // Conditional rendering for Posts
                                isLoadingPosts ? (
                                    <div className="flex flex-col items-center justify-center h-40 bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-4">
                                        <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <p className="mt-3 text-textBody dark:text-textBodyDark">Memuat postingan...</p>
                                    </div>
                                ) : dummyPosts.length === 0 ? (
                                    <div className="flex items-center justify-center h-40 bg-tertiary dark:bg-tertiaryDark rounded-md shadow text-textBody dark:text-textBodyDark p-4">
                                        Tidak ada postingan yang tersedia.
                                    </div>
                                ) : (
                                    dummyPosts.map((post) => (
                                        <PostItem key={post.id} post={post} />
                                    ))
                                )
                            )}
                        </main>

                        <div className="col-span-1 lg:col-span-3">
                            <NotificationsHistory />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
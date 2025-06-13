import { useState } from "react";
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
    const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString('id-ID', options);

    const dummyReports: Report[] = [
        {
            id: 1,
            title: "Sampah menumpuk di Taman Sempur",
            description: "Terdapat tumpukan sampah yang tidak diangkut lebih dari 3 hari.",
            image: "/images/sample-report.jpg",
            status: "Diproses",
            submittedAt: "2025-04-22",
        },
        {
            id: 2,
            title: "Jalan rusak di Jl. Pajajaran",
            description: "Lubang besar berbahaya untuk pengendara motor, perlu perbaikan.",
            image: "/images/sample-report2.jpg",
            status: "Tertunda",
            submittedAt: "2025-04-18",
        },
    ];

    const dummyPosts: PostInterface[] = [
        {
            id: 1,
            user_id: 101,
            username: "farhan.mp4",
            avatar: "/images/profile.jpg",
            image: "",
            content: "Hari ini saya melihat langsung proses pembersihan saluran air di Suryakencana. Salut untuk petugas!",
            type: "text",
            users: {
                user_id: 101,
                username: "farhan.mp4"
            },
            created_at: "1 jam lalu",
            likes: 18,
            comment_count: 4,
            like_count: 18,
            comments: {}
        },
        {
            id: 2,
            user_id: 101,
            username: "farhan.mp4",
            avatar: "/images/profile.jpg",
            image: "",
            content: "Apakah ada yang tahu siapa yang bisa dihubungi untuk perbaikan lampu jalan di daerah Bubulak?",
            type: "text",
            users: {
                user_id: 101,
                username: "farhan.mp4"
            },
            created_at: "3 hari lalu",
            likes: 42,
            comment_count: 9,
            like_count: 42,
            comments: {}
        }
    ];

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
                                    to="/postingan"
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
                            {activeTab === "report"
                                ? dummyReports.map((report, index) => (
                                    <ReportList
                                        key={report.id}
                                        report={report}
                                        index={index}
                                        hideDetailButton={true}
                                    />
                                ))
                                : dummyPosts.map((post) => (
                                    <PostItem key={post.id} post={post} />
                                ))}
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

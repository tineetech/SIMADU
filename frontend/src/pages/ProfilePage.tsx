import { useState } from "react";
import { Coins, FileText, GalleryHorizontal, Plus, Repeat } from "lucide-react";
import PostItem from "../components/PostItem";
import ReportList from "../components/ReportList";
import NotificationsHistory from "../components/NotificationsHistory";
import { Link } from "react-router-dom";
import DataUser from "../services/dataUser";
import GetPostData from "../services/getPostData";
import GetLaporanData from "../services/getLaporanData";

export default function ProfilePage() {
    const datas = DataUser();
    const { data: allPosts = [], loading: loadingPosts } = GetPostData();
    const { data: allReports = [], loading: loadingReports } = GetLaporanData();
    const [activeTab, setActiveTab] = useState("report");
    const tabs = [
        { key: "report", label: "Laporan" },
        { key: "post", label: "Postingan" },
    ];

    if (datas.loading || loadingPosts || loadingReports) {
        return <div className="text-center py-10">Memuat data...</div>;
    }

    const user = {
        id: datas?.data?.user_id ?? 0,
        firstName: datas?.data?.first_name ?? '',
        lastName: datas?.data?.last_name ?? '',
        username: datas?.data?.username ?? '',
        joinedAt: datas?.data?.created_at ?? '',
        coin: datas?.data?.amount ?? 0,
        avatar: datas?.data?.avatar ?? '',
        email: datas?.data?.email
    };

    console.log("DATA USER", datas)

    const userPosts = Array.isArray(allPosts?.data)
        ? allPosts.data.filter((post) => post.user_id === user.id)
        : [];

    const userReports = Array.isArray(allReports?.data)
        ? allReports.data.filter((report) => report.user_id === user.id)
        : [];


    console.log("USER", user)
    console.log("USER POST", userPosts)
    console.log("USER REPORT", userReports)

    const isoDate = user.joinedAt;
    const date = new Date(isoDate);
    const options = { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' };
    const formattedDate = date.toLocaleDateString('id-ID', options);

    return (
        <div className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            {/* Cover */}
            <div className="bg-lapor py-28 pb-46 relative" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mx-auto container px-4 md:px-0 pb-8 min-h-screen">

                {/* Profile Information */}
                <aside className="col-span-12 md:col-span-4 lg:col-span-3 -mt-24 relative z-10 order-1 md:order-none">
                    <div className="bg-tertiary dark:bg-tertiaryDark rounded-md shadow p-6 md:p-8">
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-36 h-36 rounded-full object-cover mx-auto"
                        />
                        <div className="flex flex-col items-center mt-4">
                            <h1 className="text-xl font-semibold">{user.firstName} {user.lastName}</h1>
                            <h2 className="text-textBody dark:text-textBodyDark">@{user.username}</h2>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* COIN */}
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <Coins className="text-yellow-500" />
                                    <div>
                                        <p className="text-sm text-textBody dark:text-textBodyDark">Coin</p>
                                        <p className="text-xl font-medium">{user.coin}</p>
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
                                        <p className="text-xl font-medium">{userReports.length}</p>
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
                                        <p className="text-xl font-medium">{userPosts.length}</p>
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
                            <p>{user.email}</p>
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
                                userReports.length > 0 ? (
                                    userReports.map((report, index) => (
                                        <ReportList
                                            key={report.id}
                                            report={report}
                                            index={index}
                                            hideDetailButton={true}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center text-sm text-textBody dark:text-textBodyDark mt-8">
                                        Belum ada laporan yang dikirim.
                                    </div>
                                )
                            ) : userPosts.length > 0 ? (
                                userPosts.map((post) => (
                                    <PostItem key={post.id} post={post} />
                                ))
                            ) : (
                                <div className="text-center text-sm text-textBody dark:text-textBodyDark mt-8">
                                    Belum ada postingan yang dibuat.
                                </div>
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardPenLine, Megaphone, Users } from 'lucide-react';
import { Report, ReportedPost } from "../types";
import MonthlyReportChart from "../components/charts/MonthlyReportChart";
import ReportCategoryChart from "../components/charts/ReportCategoryChart";
import ReportCard from "../components/cards/ReportCard";
import StatsCard from "../components/cards/StatsCard";
import ReportModal from "../components/modals/ReportModal"
import ReportedPostCard from "../components/ReportedPostList";
import PostDetailModal from "../components/modals/ReportedPostModal";
import DataUser from "../services/dataUser";
import GetLaporanData from "../services/getLaporanData";
import GetPostData from "../services/getPostData";
import GetUsersData from "../services/getUsersData";

export default function Dashboard() {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [selectedPost, setSelectedPost] = useState<ReportedPost | null>(null);
    const dataLapor = GetLaporanData()
    const dataPost = GetPostData()
    const dataUsers = GetUsersData()

    const cards = [
        {
            bgColor: "bg-red-200",
            icon: <Megaphone size={16} />,
            title: "Total Laporan",
            value: dataLapor?.data?.data?.length ?? '0',
            link: "/admin/laporan"
        },
        {
            bgColor: "bg-yellow-200",
            icon: <ClipboardPenLine size={16} />,
            title: "Postingan",
            value: dataPost?.data?.data?.length ?? 'Loading..',
            link: "/komunitas"
        },
        {
            bgColor: "bg-blue-200",
            icon: <Users size={16} />,
            title: "Total User",
            value: dataUsers?.data?.data?.length ?? '0',
            link: "/profile"
        },
    ];

    const [recentUnverified, setRecentUnverified] = useState<Report[]>([]);

    useEffect(() => {
        if (dataLapor?.data?.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const formattedReports = dataLapor.data.data.map((item: any) => ({
                user_id: item.user_id || 0,
                id: item.id || 0,
                title: item.title || 'Laporan Warga',
                submittedAt: new Date(item.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                }),
                description: item.description || 'Tidak ada deskripsi',
                image: item.image || '/images/default-report.jpg',
                status: item.status || 'pending'
            }));

            setRecentUnverified(formattedReports);
        }
    }, [dataLapor]);

    const reportedPosts: ReportedPost[] = [
        {
            reportedBy: 'RizkyPratama',
            date: '2025-04-28',
            content: 'Isi postingan mengandung ujaran kebencian terhadap kelompok tertentu.',
            reason: 'Ujaran kebencian',
            image: 'https://source.unsplash.com/random/400x300?hate'
        },
        {
            reportedBy: 'DewiAnggraini',
            date: '2025-04-25',
            content: 'Postingan ini menawarkan pekerjaan dengan gaji tinggi tetapi meminta uang pendaftaran.',
            reason: 'Penipuan',
            image: 'https://source.unsplash.com/random/400x300?fraud'
        },
        {
            reportedBy: 'YusufHalim',
            date: '2025-04-24',
            content: 'Judul clickbait dan isi tidak sesuai dengan fakta atau sumber resmi.',
            reason: 'Informasi menyesatkan',
        },
        {
            reportedBy: 'YusufHalim',
            date: '2025-04-24',
            content: 'Judul clickbait dan isi tidak sesuai dengan fakta atau sumber resmi.',
            reason: 'Informasi menyesatkan',
        }
    ];

    const datas = DataUser()

    return (
        <>
            {/* Content */}
            <div className="flex flex-col gap-8 md:grid md:grid-cols-12">
                {/* Left Section */}
                <div className="flex flex-col gap-8 md:col-span-8">

                    {/* Hero / Welcome Section */}
                    <div className="bg-tertiary dark:bg-tertiaryDark flex flex-col md:flex-row gap-8 md:gap-16 p-6 md:p-8 shadow-md rounded-md">
                        <div className="flex-col flex-1">
                            <h1 className="font-semibold text-2xl mb-4">
                                Hi {(datas.data?.username ?? 'Pengguna').toUpperCase()}
                            </h1>
                            <p className="text-textBody dark:text-textBodyDark text-sm mb-6">
                                Pantau dan kelola laporan masalah dari warga dengan mudah melalui dasbor admin simadu.
                                <span className="hidden md:inline"> Dapatkan visibilitas lengkap atas isu-isu yang dilaporkan, lacak status penanganan, dan koordinasikan tindakan penyelesaian secara efisien.</span>
                            </p>

                            <Link to='/admin/laporan' className="bg-tertiaryDark dark:bg-tertiary text-textDark dark:text-text px-6 py-3 rounded-md text-sm w-max">
                                Lihat Selengkapnya
                            </Link>
                        </div>
                        <img src="/images/cuate.svg" alt="" className="w-40 md:w-48 self-center md:self-start hidden md:block" />
                    </div>

                    {/* Monthly Chart */}
                    <div className="flex flex-col bg-tertiary dark:bg-tertiaryDark p-6 md:p-8 rounded-md shadow-md">
                        <h1 className="text-lg font-semibold mb-6 md:mb-8">Laporan Bulanan</h1>
                        <MonthlyReportChart />
                    </div>

                    {/* Report Card Section */}
                    <div className="flex flex-col">
                        <div className="flex justify-between px-4 md:px-8">
                            <h1 className="text-lg font-semibold mb-4">Laporan Terbaru</h1>
                            <Link to={'/admin/laporan'} className="font-light text-sm">
                                Lihat Semua
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-8">
                            {recentUnverified.slice(0, 3).map((report, index) => (
                                <ReportCard
                                    key={index}
                                    index={index}
                                    item={report}
                                    onViewDetail={setSelectedReport}
                                    colSpan=""
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col gap-6 md:col-span-4 bg-tertiary dark:bg-tertiaryDark rounded-md shadow-md mt-6 md:mt-0">

                    {/* Stats Cards */}
                    <div className="flex flex-col p-6 gap-4">
                        {cards.map((card, index) => (
                            <StatsCard
                                key={index}
                                bgColor={card.bgColor}
                                icon={card.icon}
                                title={card.title}
                                value={card.value}
                                link={card.link}
                            />
                        ))}
                    </div>

                    {/* Category Chart */}
                    <div className="flex flex-col px-6">
                        <h1 className="text-lg font-semibold mb-4">Kategori Laporan</h1>
                        <ReportCategoryChart />
                    </div>

                    {/* Reported Posts */}
                    <div className="flex flex-col gap-4 p-6 pb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-lg font-semibold">Postingan yang Dilaporkan</h1>
                            <p className="text-sm text-textBody dark:text-textBodyDark">{reportedPosts.length} Post</p>
                        </div>
                        {reportedPosts.slice(0, 3).map((post, index) => (
                            <ReportedPostCard key={index} post={post} onClick={() => setSelectedPost(post)} />
                        ))}
                    </div>
                </div>
            </div>

            <ReportModal report={selectedReport} onClose={() => setSelectedReport(null)}
            />

            <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        </>
    );
}

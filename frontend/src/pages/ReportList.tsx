// src/components/ReportList.tsx
import React from 'react';
import { Report } from '../types'; // Pastikan path ini benar
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MapPin, Calendar, Info, User as UserIcon, CheckCircle, Clock, XCircle } from 'lucide-react'; // Icon tambahan

interface ReportListProps {
    report: Report;
}

const ReportList: React.FC<ReportListProps> = ({ report }) => {
    // Helper function untuk mendapatkan warna status
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
            case 'proses':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100';
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    // Helper function untuk mendapatkan icon status
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return <Clock size={16} className="mr-1" />;
            case 'proses':
                return <Info size={16} className="mr-1" />;
            case 'success':
                return <CheckCircle size={16} className="mr-1" />;
            case 'failed':
                return <XCircle size={16} className="mr-1" />;
            default:
                return <Info size={16} className="mr-1" />;
        }
    };

    return (
        <div className="bg-tertiary w-full dark:bg-tertiaryDark rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row mb-6">
            {report.image && (
                <div className="md:w-1/3 flex-shrink-0">
                    <img
                        src={report.image}
                        alt={`Laporan: ${report.title}`}
                        className="w-full h-48 md:h-full object-cover"
                        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Gambar+Tidak+Tersedia'; }} // Fallback image
                    />
                </div>
            )}
            <div className="p-4 md:p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-text dark:text-textDark break-words">
                        {report.title}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(report.status)}`}>
                        {getStatusIcon(report.status)}
                        {report.status}
                    </span>
                </div>
                <p className="text-sm text-textBody dark:text-textBodyDark mb-3">
                    {report.description}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <p className="flex items-center">
                        <UserIcon size={14} className="mr-2 text-primary" />
                        Pelapor: {report.User?.username || 'Anonim'}
                    </p>
                    <p className="flex items-center">
                        <Calendar size={14} className="mr-2 text-primary" />
                        Tanggal Laporan: {format(new Date(report.submittedAt), "dd MMMM yyyy", { locale: id })}
                    </p>
                    {/* Jika Anda memiliki lokasi yang ingin ditampilkan */}
                    {/* {report.location_latitude && report.location_longitude && (
                        <p className="flex items-center">
                            <MapPin size={14} className="mr-2 text-primary" />
                            Lokasi: {report.location_latitude}, {report.location_longitude}
                        </p>
                    )} */}
                </div>
                {/* Anda bisa menambahkan tombol atau link ke detail laporan di sini */}
                {/* <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary/90">
                    Lihat Detail
                </button> */}
            </div>
        </div>
    );
};

export default ReportList;
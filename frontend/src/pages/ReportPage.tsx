import ReportForm from "../components/forms/ReportForm";

export default function ReportPage() {
    return (
        <div className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            
            {/* Hero */}
            <div className="bg-lapor dark:bg-[#668BBC] py-30 pb-50 px-4 text-center relative">
                <h1 className="text-4xl font-bold mb-2">Lapor Masalah</h1>
                <p className="max-w-2xl mx-auto">
                    Isi formulir berikut untuk melaporkan masalah di lingkungan sekitar Anda.
                </p>
            </div>

            <ReportForm />
        </div>
    );
}

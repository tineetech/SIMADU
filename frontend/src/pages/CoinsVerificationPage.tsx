import { SetStateAction, useEffect, useState } from "react";
import { Check, Circle, X } from "lucide-react";
import clsx from "clsx";
import SearchBar from "../components/widgets/SearchBar";
import { motion, AnimatePresence } from "framer-motion";
import OptionFilter from "../components/widgets/OptionFilterProps";
import Swal from "sweetalert2";

const statusColor = {
    Tertunda: "bg-yellow-100 text-yellow-800",
    Berhasil: "bg-green-100 text-green-800",
    Ditolak: "bg-red-100 text-red-800",
};

export default function CoinVerificationPage() {
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("Tertunda");
    const statusOptions = ["Semua","Pending", "Success", "Failed"];
    const [dummyData, setDummyData] = useState([])

    useEffect(() => {
        getPenukaran();
    }, []);

    const token = localStorage.getItem("authToken") ?? "";
    const getPenukaran = async () => {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/koin/riwayat-penukaran`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            
            if (!res.ok) console.log('gagal get penukaran: ', res)
                
            const data = await res.json()
            console.log(data)
            if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
                // console.log(data)
                const mappedData = data.data.map((item: any) => ({
                    id: item.transaction_id, // Sesuaikan dengan nama field ID di API
                    user: item.username,      // Sesuaikan dengan nama field username di API
                    target: item.number_target,      // Sesuaikan dengan nama field username di API
                    email: item.email,        // Sesuaikan dengan nama field email di API
                    coin: item.amount,        // Sesuaikan dengan nama field jumlah koin di API
                    method: item.method_target, // Sesuaikan dengan nama field metode di API
                    date: item.created_at.split('T')[0] + ' ' + item.created_at.split('T')[1].split('.')[0], // Format tanggal dan waktu
                    status: item.status,      // Sesuaikan dengan nama field status di API
                }));
                setDummyData(mappedData);
            } else {
                console.log("Tidak ada data penukaran yang valid dari API.");
                setDummyData([]);
            }

            console.log(data);
        } catch (e) {
            console.log(e);
        }
    };

    const filteredData = dummyData.filter(
        (item) =>
            (filterStatus === "Semua" || item.status === filterStatus.toLowerCase()) &&
            (item.user.toLowerCase().includes(search.toLowerCase()) ||
                item.email.toLowerCase().includes(search.toLowerCase()))
    );

    function generateTransactionId() {
        // Generate random 5 digit number
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        
        // Get current date in DDMMYY format
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear()).slice(-2);
        const currentDate = `${day}${month}${year}`;
        
        return `TRX-CO-${randomNum}-${currentDate}`;
    }

    const [tokenPayment, setTokenPayment] = useState('')   
    const [currentOrderId, setCurrentOrderId] = useState(''); 
    const [currentRedirect, setCurrentRedirect] = useState(''); 
    const [currentTrxId, setCurrentTrxId] = useState(''); 
    const handleVerify = async (id: number, amount: number, username: string, email: string, nomor_tujuan: number) => {
        try {
            const orderId = generateTransactionId();
            setCurrentOrderId(orderId); // Simpan order_id ke state
            setCurrentTrxId(id.toString())
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/koin/bayar-penukaran`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    idTrx: id,
                    order_id: orderId,
                    productName: "PENUKARAN KOIN KE UANG DIGITAL ()",
                    price: amount,
                    userName: username,
                    email,
                    nomor_tujuan
                })
            })

            
            if (!res.ok) {
                const data = await res.json();
                console.error(data);
                Swal.fire({
                    title: "Gagal Membayar Penukaran",
                    text: "Terjadi kesalahan saat menghubungi server.",
                    icon: "error",
                });
                return;
            }
                
            const data = await res.json()
            console.log(data)
            
            setTokenPayment(data.token)
            setCurrentRedirect(data.redirect_url)
            setTimeout(() => {
                window.open(data.redirect_url)
            }, 800);
        } catch (e) {
            console.log(e)
        }
    };

    const confirmationPayment = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/koin/confirm-penukaran/` + currentOrderId, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ trxId: parseInt(currentTrxId) })
            })

            
            if (!res.ok) {
                const data = await res.json();
                console.error(data);
                Swal.fire({
                    title: "Gagal Konfirmasi Pembayaran",
                    text: "Terjadi kesalahan saat menghubungi server.",
                    icon: "error",
                });
                return;
            }
                
            const data = await res.json()
            console.log(data)
            
            if (data.status === "settlement") {
                setTokenPayment("")
                Swal.fire({
                    title: "Berhasil Membayar Penukaran.",
                    text: "Penukaran koin telah dibayar.",
                    icon: "success",
                }).then((res) => {
                    if (res.isConfirmed) {
                        location.reload();
                    }
                });
            } else {
                Swal.fire({
                    title: "Gagal !",
                    text: "Pembayaran tidak berhasil, coba lagi.",
                    icon: "error",
                }).then((res) => {
                    if (res.isConfirmed) {
                        window.open(currentRedirect)
                    }
                });
            }
        } catch (e) {
            console.error(e)
        }
    };

    const handleReject = (id: number) => {
        console.log("Ditolak ID:", id);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between gap-3">
                <OptionFilter
                    options={statusOptions}
                    selected={filterStatus}
                    onChange={(val: SetStateAction<string>) => setFilterStatus(val)}
                />
                <div className="max-w-md">
                    <SearchBar
                        value={search}
                        onChange={(val) => setSearch(val)}
                        placeHolder="Cari pengguna..."
                    />
                </div>
            </div>
            <div className={`w-full h-screen fixed start-0 top-0 ${tokenPayment !== "" ? 'flex' : "hidden"} items-center justify-center`} style={{background: "rgba(0,0,0,.2)", zIndex: '999'}}>
            <div className="flex w-[300px] container px-3 h-auto py-10 rounded-2xl bg-gray-300 dark:bg-gray-800 flex-col">
                <h1 className="font-bold text-center">Melakukan Pembayaran..</h1>
                <div className="flex flex-col gap-2 mt-5">
                    <button className="w-full py-3 mt-3 rounded-md bg-primary cursor-pointer" onClick={() => confirmationPayment()}>
                        Konfirmasi Pembayaran
                    </button>
                </div>
            </div>
            </div>

            {/* Desktop Table */}
            <div className="bg-tertiary dark:bg-tertiaryDark shadow-md rounded-md border border-textBody overflow-x-auto hidden md:block">
                <table className="min-w-full text-sm">
                    <thead className="text-left uppercase text-xs bg-primary dark:bg-primaryDark text-textDark">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Email</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Metode</th>
                            <th className="p-4">No. Tujuan</th>
                            <th className="p-4">Tanggal</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredData.map((item: any) => (
                                <motion.tr
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="border-t border-textBody"
                                >
                                    <td className="p-4">{item.user}</td>
                                    <td className="p-4">{item.email}</td>
                                    <td className="p-4">
                                        {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 2
                                        }).format(item.coin)}
                                    </td>
                                    <td className="p-4">{item.method}</td>
                                    <td className="p-4">{item.target}</td>
                                    <td className="p-4">{item.date}</td>
                                    <td className="p-4">
                                        <span
                                            className={clsx(
                                                "px-2 py-1 rounded-full text-xs font-medium",
                                                statusColor[item.status as keyof typeof statusColor]
                                            )}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center space-x-2 text-textDark">
                                        <button
                                            onClick={() => handleVerify(item.id, item.coin, item.user, item.email, item.target)}
                                            disabled={item.status !== "pending"}
                                            className={clsx(
                                                "p-1.5 rounded-md cursor-pointer",
                                                item.status === "pending"
                                                    ? "bg-green-500 hover:bg-green-600"
                                                    : "bg-green-900 opacity-40 cursor-not-allowed"
                                            )}
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.id)}
                                            disabled={item.status !== "pending"}
                                            className={clsx(
                                                "p-1.5 rounded-md cursor-pointer",
                                                item.status === "pending"
                                                    ? "bg-red-500 hover:bg-red-600"
                                                    : "bg-red-900 opacity-40 cursor-not-allowed"
                                            )}
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                        {filteredData.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-6 text-center text-gray-400">
                                    Tidak ada data ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
                {filteredData.map((item) => (
                    <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-tertiary dark:bg-tertiaryDark rounded-md p-4 shadow-md border border-textBody"
                    >
                        <div className="flex flex-col gap-1 text-sm">
                            <div className="flex justify-between w-full items-center">
                                <h3 className="text-lg font-medium">{item.user}</h3>
                                <span
                                    className={clsx(
                                        "px-2 py-1 rounded-full text-xs font-medium inline-block",
                                        statusColor[item.status as keyof typeof statusColor]
                                    )}
                                >
                                    {item.status}
                                </span>
                            </div>
                            <h4 className="text-textBody dark:text-textBodyDark">{item.email}</h4>
                            <h4 className="text-lg">Metode : {item.method}</h4>
                            <h4 className="text-lg">Jumlah : {item.coin}</h4>
                        </div>

                        <div className="flex justify-between mt-4 items-center">
                            <h4>{item.date}</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerify(item.id)}
                                    disabled={item.status !== "Tertunda"}
                                    className={clsx(
                                        "p-2 rounded-md text-white",
                                        item.status === "Tertunda"
                                            ? "bg-green-500 hover:bg-green-600"
                                            : "bg-green-900 opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleReject(item.id)}
                                    disabled={item.status !== "Tertunda"}
                                    className={clsx(
                                        "p-2 rounded-md text-white",
                                        item.status === "Tertunda"
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-red-900 opacity-40 cursor-not-allowed"
                                    )}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredData.length === 0 && (
                    <div className="text-center text-gray-400 p-4">
                        Tidak ada data ditemukan.
                    </div>
                )}
            </div>
        </div>
    );
}

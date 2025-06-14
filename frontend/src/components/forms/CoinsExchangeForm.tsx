 
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TermsModal from "../modals/TermsModal";
import DataUser from "../../services/dataUser";
import { Coins } from "lucide-react";
import Swal from "sweetalert2";

export default function CoinExchangeForm() {
    const datas = DataUser()
    
    const dummyUser = {
        name: datas?.data?.username ?? '',
        coins: datas?.data?.amount ?? 0,
    };

    const [showModal, setShowModal] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [amount, setAmount] = useState("");
    const [isNotRibuan, setIsNotRibuan] = useState(false);
    const [isBelowMinimum, setIsBelowMinimum] = useState(false);
    const [isExceedingBalance, setIsExceedingBalance] = useState(false);
    const [termsChecked, setTermsChecked] = useState(false);

    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<string | null>(null);
    const [accountNumber, setAccountNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    const options = {
        Bank: ["BCA", "Mandiri", "BNI", "BRI"],
        "E-Wallet": ["DANA", "OVO", "GoPay", "ShopeePay"],
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAmount(value);

        const numericValue = Number(value);
        setIsBelowMinimum(numericValue > 0 && numericValue < 1000);
        setIsNotRibuan(numericValue % 1000 !== 0 && !isNaN(numericValue)); // Pastikan numericValue adalah angka
        setIsExceedingBalance(numericValue > dummyUser.coins);
    };

    const handleTermsClick = () => {
        setShowModal(true);
    };

    const handleAgree = () => {
        setAgreed(true);
        setTermsChecked(true);
        setShowModal(false);
    };

    const handleSelect = (item: string) => {
        setSelected(item);
        setOpen(false);
        setAccountNumber("");
        setPhoneNumber("");
    };

    const isBank = selected && ["BCA", "Mandiri", "BNI", "BRI"].includes(selected);
    const isEWallet = selected && ["DANA", "OVO", "GoPay", "ShopeePay"].includes(selected);

    
    if (datas.loading) {
        return 'loading..'
    }

    const token = localStorage.getItem('authToken') ?? '';
    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log(selected)
        try {
            if (parseInt(amount) % 1000 !== 0 && !isNaN(parseInt(amount))) {
                Swal.fire({
                    title: "Gagal!",
                    text: 'Nilai jumlah penukaran harus berupa kelipatan ribuan (1000)',
                    icon: "error",
                }) 
                return
            }


            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/koin/request-penukaran`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user_id: datas.data?.user_id ?? '',
                    coin: dummyUser.coins ?? 0,
                    number_target: isBank ? accountNumber : isEWallet ? phoneNumber : "",
                    method_target: selected,
                    amount: amount
                })
            })

            const data = await res.json()

            if (!res) alert(res) 
            
            console.log(data)
            Swal.fire({
                title: "Berhasil!",
                text: "Berhasil melakukan request penukaran koin, mohon menunggu 1-2 hari untuk verifikasi data dan pengiriman saldo.",
                icon: "success",
            }).then((res) => {
                if (res.isConfirmed) {
                window.location.href = '/profile'
                }
            });
        } catch (e) {
            alert(e)
            console.log(e)
        }
    }

    return (
        <>
            <form className="bg-tertiary dark:bg-tertiaryDark p-6 rounded-lg shadow-md max-w-md mx-auto mt-10 space-y-6" onSubmit={(e) => handleSubmit(e)}>

                {/* ✅ Jumlah Koin User */}
                <div className="justify-between flex">
                    <h2 className="text-xl font-semibold">Tukar Koin</h2>
                    <div className="text-sm text-text flex gap-1 dark:text-textDark">
                        <Coins />
                        <span className="font-semibold"> {dummyUser?.coins.toLocaleString()}</span>
                    </div>
                </div>

                {/* ✅ Input Jumlah Koin */}
                <div className="flex flex-col">
                    <label htmlFor="amount" className="text-sm mb-1">Jumlah Uang Yang Ingin Ditukarkan</label>
                    <input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={handleAmountChange}
                        className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody"
                        placeholder="Masukkan jumlah uang penukaran"
                    />
                    {isNotRibuan && (
                        <p className="text-red-500 text-sm mt-1">Nilai jumlah penukaran harus berupa kelipatan ribuan (1000)</p>
                    )}
                    {isBelowMinimum && (
                        <p className="text-red-500 text-sm mt-1">Minimal penukaran adalah Rp 1.000</p>
                    )}
                    {isExceedingBalance && (
                        <p className="text-red-500 text-sm mt-1">Koin tidak cukup untuk jumlah tersebut</p>
                    )}
                </div>

                {/* ✅ Pilih metode penukaran */}
                <div className="relative">
                    <label className="text-sm mb-1 block">Pilih Metode Penukaran</label>
                    <div
                        className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody cursor-pointer"
                        onClick={() => setOpen((prev) => !prev)}
                    >
                        {selected || "Pilih opsi penukaran..."}
                    </div>

                    <AnimatePresence>
                        {open && (
                            <motion.ul
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-50 w-full max-h-40 overflow-y-auto bg-white dark:bg-backgroundDark border rounded shadow-lg"
                            >
                                {Object.entries(options).map(([group, values]) => (
                                    <li key={group} className="px-3 py-1 font-semibold">
                                        {group}
                                        <ul>
                                            {values.map((item) => (
                                                <li
                                                    key={item}
                                                    className="text-sm px-3 py-2 text-textBody dark:text-textBodyDark hover:bg-accent hover:text-white dark:hover:bg-accentDark cursor-pointer"
                                                    onClick={() => handleSelect(item)}
                                                >
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </motion.ul>
                        )}
                    </AnimatePresence>
                </div>

                {/* ✅ Tambahan input berdasarkan metode */}
                {isBank && (
                    <div className="flex flex-col">
                        <label htmlFor="rekening" className="text-sm mb-1">Nomor Rekening</label>
                        <input
                            id="rekening"
                            type="text"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody"
                            placeholder="Masukkan nomor rekening"
                        />
                    </div>
                )}

                {isEWallet && (
                    <div className="flex flex-col">
                        <label htmlFor="telepon" className="text-sm mb-1">Nomor Telepon</label>
                        <input
                            id="telepon"
                            type="text"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="p-2 rounded bg-background dark:bg-backgroundDark border border-textBody"
                            placeholder="Masukkan nomor telepon e-wallet"
                        />
                    </div>
                )}

                {/* ✅ Information exchange coins */}
                <div className="flex items-start gap-2 text-sm">
                    <label className="cursor-pointer text-gray-400">
                        1.000 koin = Rp1.000
                    </label>
                </div>

                {/* ✅ Terms & Conditions */}
                <div className="flex items-start gap-2 text-sm">
                    <input
                        type="checkbox"
                        id="terms"
                        checked={termsChecked}
                        onChange={handleTermsClick}
                        className="mt-1"
                    />
                    <label htmlFor="terms" onClick={handleTermsClick} className="cursor-pointer">
                        Saya menyetujui <span className="underline">syarat dan ketentuan</span>
                    </label>
                </div>

                {/* ✅ Tombol Submit */}
                <button
                    type="submit"
                    disabled={!agreed || Number(amount) < 1000 || Number(amount) > dummyUser.coins}
                    className={`w-full p-2 rounded ${agreed && Number(amount) >= 1000 && Number(amount) <= dummyUser.coins
                        ? "bg-accent hover:opacity-90"
                        : "bg-gray-500 cursor-not-allowed"
                        }`}
                >
                    Tukar Sekarang
                </button>
            </form>

            {showModal && (
                <TermsModal
                    onClose={() => setShowModal(false)}
                    onAgree={handleAgree}
                />
            )}
        </>
    );
}

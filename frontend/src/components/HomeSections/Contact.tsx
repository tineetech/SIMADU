import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [errors, setErrors] = useState({
        email: false,
        message: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: false });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            email: formData.email.trim() === "",
            message: formData.message.trim() === "",
        };

        setErrors(newErrors);
        const text = `
            Halo, email saya : ${formData.email}, pesan saya : ${formData.message}
        `
        if (!newErrors.email && !newErrors.message) {
            window.open('https://wa.me/6287774487198?text=' + text)
            setFormData({ name: "", email: "", message: "" });
        }
    };

    return (
        <section className="px-6 pb-20">
            <div className="flex flex-col md:flex-row gap-12 md:items-start md:justify-between space-x-4">
                <div className="md:w-1/2 space-y-6 md:pr-12 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-bold leading-snug">
                        Hubungi Kami Segera! Kami Siap Membantu anda
                    </h2>
                    <p className="text-sm md:text-lg">
                        Jika Anda memiliki pertanyaan, saran, atau butuh informasi lebih lanjut,
                        jangan ragu untuk menghubungi kami. Tim kami akan merespons secepat mungkin dengan bantuan yang ramah dan profesional.
                    </p>
                    <p className="text-md">
                        Balasan biasanya dalam waktu 1x24 jam kerja.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="md:w-1/2 space-y-6 w-full"
                >

                    {/* Email */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <label className="block font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none ${errors.email} ? "border-red-500" : "border-gray-10"}`}
                            placeholder="Alamat email aktif"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">Email wajib diisi.</p>}
                    </motion.div>

                    {/* Pesan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <label className="block font-medium">Pesan</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none h-32 ${errors.message ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Tulis pesan Anda..."
                        />
                        {errors.message && <p className="text-red-500 text-sm mt-1">Pesan tidak boleh kosong.</p>}
                    </motion.div>

                    {/* Submit */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <button
                            type="submit"
                            className="w-full bg-primary text-white font-semibold cursor-pointer py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                        >
                            Kirim Pesan
                        </button>
                    </motion.div>
                </form>
            </div>
        </section>
    );
}

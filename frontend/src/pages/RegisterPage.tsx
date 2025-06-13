import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function RegisterPage() {
	const navigate = useNavigate()
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		const usnInput = target.elements.namedItem('username') as HTMLInputElement; // Lebih aman menggunakan name
		const emailInput = target.elements.namedItem('email') as HTMLInputElement; // Lebih aman menggunakan name
		const passwordInput = target.elements.namedItem('password') as HTMLInputElement; // Lebih aman menggunakan name

		const username = usnInput?.value;
		const email = emailInput?.value;
		const password = passwordInput?.value;

		try {
			const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password, username }),
			});

			const data = await response.json();

			if (response.ok) {
				Swal.fire({
					title: "Berhasil Buat Akun!",
					text: "Berhasil buat akun, silakan login.",
					icon: "success",
				}).then((res) => {
					if (res.isConfirmed) {
						navigate("/login");
					}
				});
			} else {
				alert(`Gagal login: ${data.message || 'Terjadi kesalahan'}`); // Menampilkan pesan error dari backend jika ada
				console.error('Login gagal:', data);
			}
		} catch (error) {
			alert('Terjadi kesalahan saat menghubungi server.');
			console.error('Error login:', error);
		}
	};

	return (
		<div className=" bg-background w-full flex items-center justify-center text-text dark:bg-backgroundDark !py-30 dark:text-textDark h-auto">
			<div className="bg-white dark:bg-gray-700 dark:border-0 border-1 text-center p-10 border-gray-300 w-[450px] h-auto rounded-2xl">
				<h1 className="text-center font-bold text-2xl">Register simadu</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5 my-8">
					<input
						type="text"
						name="username"
						placeholder="Masukan Username.."
						className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0  rounded-lg"
						required // Tambahkan validasi form
					/>
					<input
						type="email"
						name="email"
						placeholder="Masukan Email.."
						className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0  rounded-lg"
						required // Tambahkan validasi form
					/>
					<input
						type="password"
						name="password"
						placeholder="Masukan Password.."
						className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0  rounded-lg"
						required // Tambahkan validasi form
					/>
					<button type="submit" className="btn bg-primary hover:bg-blue-500 transition-all ease-in-out cursor-pointer text-white rounded-2xl py-3">
						Buat Akun
					</button>
				</form>
				<p>
					Sudah punya akun? <a href="/login" className="underline">Login disini.</a>
				</p>
				<p>
					Lupa Password? <a href="/reset-password" className="underline">Reset sandi.</a>
				</p>
			</div>
		</div>
	);
}
import Swal from "sweetalert2";
import useCheckResetToken from "../services/cekResetToken";

export default function VerifyResetPassPage() {
	const token = localStorage.getItem('resetToken') ?? '';

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const target = e.target as HTMLFormElement;
		//   const oldPassInput = target.elements.namedItem('oldPassword') as HTMLInputElement;
		const newPassInput = target.elements.namedItem('newPassword') as HTMLInputElement;
		const confirmtNewPassInput = target.elements.namedItem('confirmNewPassword') as HTMLInputElement;

		//   const oldPassword = oldPassInput?.value;
		const newPassword = newPassInput?.value;
		const confirmNewPassword = confirmtNewPassInput?.value;

		try {
			const response = await fetch(`${import.meta.env.VITE_USER_SERVICE}/api/auth/verify/reset-password`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify({ password: newPassword, confirmPassword: confirmNewPassword }),
			});

			const data = await response.json();

			if (response.ok) {
				Swal.fire({
					title: "Berhasil Reset Password!",
					text: "berhasil reset password mu, silakan login.",
					icon: "success",
				}).then((res) => {
					if (res.isConfirmed) {
						window.location.href = '/login'
					}
				});
			} else {
				alert(`Gagal reset pass: ${data.message || 'Terjadi kesalahan'}`); // Menampilkan pesan error dari backend jika ada
				console.error('reset gagal:', data);
			}
		} catch (error) {
			alert('Terjadi kesalahan saat menghubungi server.');
			console.error('Error reset:', error);
		}
	};

	useCheckResetToken(token);
	return (
		<div className=" bg-background w-full flex items-center justify-center text-text dark:bg-backgroundDark py-40 dark:text-textDark h-auto">
			<div className="bg-white dark:bg-gray-700 dark:border-0 border-1 text-center p-10 border-gray-300 w-[90%] md:w-[450px] h-auto rounded-2xl">
				<h1 className="text-center font-bold text-2xl">Reset Your Password</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5 my-8">
					{/* <input
			  type="password"
			  name="oldPassword"
			  placeholder="Masukan Password Lama.."
			  className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0 rounded-lg"
			  required // Tambahkan validasi form
			/> */}
					<input
						type="password"
						name="newPassword"
						placeholder="Masukan Password Baru.."
						className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0 rounded-lg"
						required // Tambahkan validasi form
					/>
					<input
						type="password"
						name="confirmNewPassword"
						placeholder="Masukan Lagi Password Baru.."
						className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0 rounded-lg"
						required // Tambahkan validasi form
					/>
					<button type="submit" className="btn bg-primary hover:bg-blue-500 transition-all ease-in-out cursor-pointer text-white rounded-2xl py-3">
						Kirim Reset Link
					</button>
				</form>
				<p>
					Sudah punya akun? <a href="/login" className="underline">Login disini.</a>
				</p>
				<p>
					Belum punya akun? <a href="/register" className="underline">Register disini.</a>
				</p>
			</div>
		</div>
	);
}
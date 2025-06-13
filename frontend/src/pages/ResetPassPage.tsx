import Swal from "sweetalert2";

export default function ResetPassPage() {
	const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
	  const target = e.target as HTMLFormElement;
	  const emailInput = target.elements.namedItem('email') as HTMLInputElement;
  
	  const email = emailInput?.value;
  
	  try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ email }),
		});
  
		const data = await response.json();
  
		if (response.ok) {
			localStorage.setItem('resetToken', data.token);
			Swal.fire({
			  title: "Berhasil Kirim Link!",
			  text: "Silakan cek email untuk reset password.",
			  icon: "success",
			}).then((res) => {
			  if (res.isConfirmed) {
				location.reload()
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
	  <div className=" bg-background w-full flex items-center justify-center text-text dark:bg-backgroundDark pt-10 dark:text-textDark h-screen">
		<div className="bg-white dark:bg-gray-700 dark:border-0 border-1 text-center p-10 border-gray-300 w-[90%] md:w-[450px] h-auto rounded-2xl">
		  <h1 className="text-center font-bold text-2xl">Reset Password simadu</h1>
		  <form onSubmit={handleSubmit} className="flex flex-col gap-5 my-8">
			<input
			  type="email"
			  name="email"
			  placeholder="Masukan Email.."
			  className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0  rounded-lg"
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
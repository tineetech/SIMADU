import Swal from "sweetalert2";

export default function LoginPage() {
	const handleSubmit = async (e: React.FormEvent) => {
	  e.preventDefault();
	  const target = e.target as HTMLFormElement;
	  const emailInput = target.elements.namedItem('email') as HTMLInputElement; // Lebih aman menggunakan name
	  const passwordInput = target.elements.namedItem('password') as HTMLInputElement; // Lebih aman menggunakan name
  
	  const email = emailInput?.value;
	  const password = passwordInput?.value;
  
	  try {
		const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify({ email, password }),
		});
  
		const data = await response.json();

		if (response.ok) {
			localStorage.setItem('authToken', data.token); // Asumsi backend mengembalikan token di properti 'token'
			Swal.fire({
			  title: "Berhasil Login!",
			  text: "Anda sudah login.",
			  icon: "success",
			}).then((res) => {
			  if (res.isConfirmed) {
				console.log(data)
				if (data.results.role === 'admin') {
					console.log('ini admin')
					window.location.href = '/admin'
					return
				}
				window.location.href = '/'
			  }
			});
		} else {
			Swal.fire({
				title: "Gagal Login!",
				text: data.message,
				icon: "error",
			  })
		  console.error('Login gagal:', data);
		}
	  } catch (error) {
		alert('Terjadi kesalahan saat menghubungi server.');
		console.error('Error login:', error);
	  }
	};
  
	return (
	  <div className=" bg-background w-full flex items-center justify-center text-text dark:bg-backgroundDark pt-20 dark:text-textDark h-screen">
		<div className="bg-white dark:bg-gray-700 dark:border-0 border-1 text-center p-10 border-gray-300 w-[90%] md:w-[450px] h-auto rounded-2xl">
		  <h1 className="text-center font-bold text-2xl">Login simadu</h1>
		  <form onSubmit={handleSubmit} className="flex flex-col gap-5 my-8">
			<input
			  type="email"
			  name="email"
			  placeholder="Masukan Email.."
			  className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0 rounded-lg"
			  required // Tambahkan validasi form
			/>
			<input
			  type="password"
			  name="password"
			  placeholder="Masukan Password.."
			  className="w-full py-4 px-3 border bg-white border-gray-200 dark:bg-gray-600 dark:border-0 rounded-lg"
			  required // Tambahkan validasi form
			/>
			<button type="submit" className="btn bg-primary hover:bg-blue-500 transition-all ease-in-out cursor-pointer text-white rounded-2xl py-3">
			  Login
			</button>
		  </form>
		  <p>
			Belum punya akun? <a href="/register" className="underline">Daftar disini.</a>
		  </p>
		  <p>
			Lupa Password? <a href="/reset-password" className="underline">Reset sandi.</a>
		  </p>
		</div>
	  </div>
	);
  }
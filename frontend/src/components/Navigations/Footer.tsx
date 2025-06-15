export default function Footer() {
  return (
    <footer className="mx-10">
      <div className="container bg-gray-200 dark:bg-tertiaryDark dark:text-textDark rounded-xl mx-auto py-10 mb-10 px-10">
        <div className="justify-between gap-10 flex flex-wrap md:gap-4">
          {/* Logo & Deskripsi */}
          <div className="w-90">            
            <div className="flex gap-3 mb-3">
              <img src="/images/logo.png" className="w-10 h-10 flex dark:hidden" alt="" />
              <img src="/images/logo2.png" className="w-10 h-10 hidden dark:flex" alt="" />
              <h2 className="text-2xl font-bold mb-3">simadu</h2>
            </div>
            <p className="text-sm leading-relaxed">
              Platform AI & komunitas untuk membantu masyarakat melaporkan masalah kota dan berbagi solusi demi lingkungan yang lebih baik.
            </p>
          </div>

          {/* Navigasi */}
          <div className="flex md:justify-center items-center space-x-6">
            <ul className="space-y-4 text-sm">
              <li><a href="/" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Beranda</a></li>
              <li><a href="/lapor" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Lapor Masalah</a></li>
              <li><a href="/komunitas" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Komunitas</a></li>
            </ul>
            <ul className="space-y-4 text-sm">
              {/* <li><a href="/artikel" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Artikel</a></li> */}
              <li><a href="/login" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Login</a></li>
              <li><a href="/register" className="hover:bg-primary hover:text-white rounded-full py-1 px-2.5 transition-all ease-in-out">Register</a></li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Kontak</h3>
            <ul className="text-sm space-y-2">
              <li>Email: simadu@gmail.com</li>
              <li>WhatsApp: +62 812 3456 7890</li>
              <li>Alamat: Jl. Raya Tajur, Kp. Buntar RT.02/RW.08, Kel. Muara sari, Kec. Bogor Selatan.</li>
            </ul>
          </div>
        </div>

        {/* Garis & Copyright */}
        <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} simadu. Semua hak dilindungi.
        </div>
      </div>
    </footer>
  );
}

import Swal from "sweetalert2";

const logoutUser = () => {
  localStorage.removeItem("authToken");
  Swal.fire({
    title: "Berhasil Logout!",
    text: "Berhasil logout, silakan login kembali.",
    icon: "success",
  }).then((res) => {
    if (res.isConfirmed) {
      window.location.href = '/login'
    }
  });
};

export default logoutUser;
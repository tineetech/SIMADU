import axios from "axios";
import { ReportedPost } from "../types";

const GetReportedPosts = async (): Promise<ReportedPost[]> => {
    const token = localStorage.getItem("authToken");

    const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/reports/all`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = response.data.map((item: any) => ({
        reportedBy: item.User?.username || "Anonim",
        date: new Date(item.created_at).toISOString().split("T")[0],
        content: item.Postingan?.content || "Konten tidak tersedia",
        reason: item.reason || "Tidak ada alasan",
        image: `https://source.unsplash.com/random/400x300?post-${item.id}`, // dummy image
    }));

    return data;
};

export default GetReportedPosts;

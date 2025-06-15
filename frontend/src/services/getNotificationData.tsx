import DataUser from "./dataUser";

export interface Notification {
    id: number;
    title: string;
    description: string;
    date: string;
    checked: boolean;
}

export const getAllNotifications = async (): Promise<Notification[]> => {
    const datas = DataUser();
    const token = localStorage.getItem("authToken") ?? "";

    try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notification`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            console.warn("Gagal mengambil notifikasi:", res);
            return [];
        }

        const data = await res.json();
        const filtered = data?.data?.filter(
            (item: any) => item.user_id === datas.data?.user_id
        );

        if (!Array.isArray(filtered)) return [];

        return filtered.map((item: any) => ({
            id: item.id,
            title: item.title,
            description: item.message,
            date: item.created_at.split("T")[0],
            checked: !!item.is_read,
        }));
    } catch (error) {
        console.error("Error fetch notifikasi:", error);
        return [];
    }
};

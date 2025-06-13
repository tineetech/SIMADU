import { useEffect, useState } from "react";
import PostForm from "../components/forms/PostForm";
import PostItem from "../components/PostItem";
import SortFilter from "../components/widgets/SortFilter";
import TrendingTopics from "../components/TrendingTopics";
import { PostInterface } from "../types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import checkIsLogin from "../services/checkIsLogin";

export default function CommunityPage() {
    const [sortBy, setSortBy] = useState("terbaru");
    const [posts, setPosts] = useState<PostInterface[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${import.meta.env.VITE_POST_SERVICE}/api/postingan/?page=${page}&limit=10}`
            );
            const data = await response.json();
            if (data?.data) {
                setPosts(data.data);
                setTotalPages(data.pagination.totalPages);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [page]);

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage((prevPage) => prevPage - 1);
        }
    };

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "populer") return b.like_count - a.like_count;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loadingCheck, setLoadingCheck] = useState(true);
    useEffect(() => {
        const verifyAuth = async () => {
            const loggedIn: any = await checkIsLogin();
            setIsAuthenticated(loggedIn);
            setLoadingCheck(false);
        };
        verifyAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Atau tampilkan spinner
    }
    
    return (
        <section className="bg-background text-text dark:bg-backgroundDark py-10 dark:text-textDark h-full">
            <div className="container mx-auto w-full py-12 pt-24 px-6">
                <h1 className="text-3xl font-bold mb-6">Komunitas</h1>
                {
                    isAuthenticated ? (
                        <PostForm />
                    ) : ''
                }
                {
                    sortedPosts.length > 0 ? (
                        <TrendingTopics post={sortedPosts} />
                    ) : ''
                }
                <SortFilter sortBy={sortBy} setSortBy={setSortBy} />
                <div className="space-y-6">
                    {loading ? (
                        <div className="flex flex-col gap-5 mt-5 ">
                            <div className="bg-gray-100  dark:bg-tertiaryDark w-full overflow-hidden rounded-xl">
                                <div className="loading-box w-full h-full py-20 bg-tertiaryDark dark:bg-white">
                                </div>
                            </div>
                            <div className="bg-gray-100  dark:bg-tertiaryDark w-full overflow-hidden rounded-xl">
                                <div className="loading-box w-full h-full py-20 bg-tertiaryDark dark:bg-white">
                                </div>
                            </div>
                        </div>
                    ) : sortedPosts.length > 0 ? (
                        sortedPosts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-4">Tidak ada postingan.</p>
                    )}
                </div>
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={handlePrevPage}
                        disabled={page === 1}
                        className="px-4 py-2 mx-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                        Halaman {page} dari {totalPages}
                    </span>
                    <button
                        onClick={handleNextPage}
                        disabled={page === totalPages}
                        className="px-4 py-2 mx-2 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 disabled:opacity-50"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </section>
    );
}
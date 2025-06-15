import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThumbsUp, MessageCircle, Share2, Send, Flag, MessageCircleMore, Facebook, Twitter, Instagram, X, Circle } from "lucide-react";
import Comment from "./Comment";
import { jwtDecode } from "jwt-decode";
import { PostInterface } from "../types";
import Swal from "sweetalert2";

export default function PostItem({ post }: { post: PostInterface }) {
  const [showComments, setShowComments] = useState(false);
  const [content, setContent] = useState("");
  const token = localStorage.getItem("authToken") ?? "";
  const [showSharePopup, setShowSharePopup] = useState(false);
  const shareButtonRef = useRef<HTMLButtonElement | null>(null);
  const [replyToUser, setReplyToUser] = useState('')
  const [replyCommentId, setReplyCommentId] = useState('')

  const handleLike = async (postId: number) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/${postId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        console.log(data);
      }
      
      Swal.fire({
          title: "Berhasil Like Postingan",
          text: "Postingan berhasil dilike.",
          icon: "success",
      }).then((res) => {
          if (res.isConfirmed) {
              location.reload()
          }
      })
    } catch (e) {
      console.log(e);
    }
  };

  const handleReportedPost = () => {
    console.log("Postingan telah dilaporkan");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleShare = () => {
    const postUrl = window.location.href;
    const text = encodeURIComponent(`Cek postingan ini!`);

    const shareOptions = [
      {
        name: "WhatsApp",
        url: `https://wa.me/?text=${text}%20${encodeURIComponent(postUrl)}`,
      },
      {
        name: "Facebook",
        url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      },
      {
        name: "X",
        url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`,
      },
      {
        name: "Instagram",
        url: `https://www.instagram.com/`,
      },
    ];

    shareOptions.forEach((option) => {
      window.open(option.url, "_blank");
    });
  };

  const handlePlatformShare = (platform: string) => {
    const postUrl = window.location.href;
    const text = encodeURIComponent(`Cek postingan ini!`);
    let url = "";

    switch (platform) {
      case "whatsapp":
        url = `https://wa.me/?text=${text}%20${encodeURIComponent(postUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${text}`;
        break;
      case "instagram":
        url = `https://www.instagram.com/`;
        break;
      default:
        return;
    }

    window.open(url, "_blank");
    setShowSharePopup(false);
  };
  
  const handleReplySecondary = (id: string, username: string) => {
    setReplyCommentId(id)
    setReplyToUser(username)
  }

  const handleComment = async (id: number) => {

    if (replyToUser !== "" && replyCommentId !== "") {
      handleReply(parseInt(replyCommentId))
      return
    }

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("content", content);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/${id}/comments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          title: "Gagal Membuat Komentar",
          text: "Terjadi kesalahan saat menghubungi server.",
          icon: "error",
        });
        return;
      }

      const data = await res.json();
      console.log(data);

      Swal.fire({
        title: "Berhasil Menambahkan Komentar.",
        text: "Komentar berhasil ditambahkan.",
        icon: "success",
      }).then((res) => {
        if (res.isConfirmed) {
          location.reload();
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const date = post.created_at;

  const formattedDate = date;
  
  let decodedToken: any = ""
  if (token) {
    decodedToken = jwtDecode(token);
  }

  const handleReply = async (commentId: number) => {
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("content", content);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/comments/${commentId}/replies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          title: "Gagal Membuat Balasan Komentar",
          text: "Terjadi kesalahan saat menghubungi server.",
          icon: "error",
        });
        return;
      }

      const data = await res.json();
      console.log(data);

      Swal.fire({
        title: "Berhasil Menambahkan Balasan Komentar.",
        text: "Komentar berhasil ditambahkan.",
        icon: "success",
      }).then((res) => {
        if (res.isConfirmed) {
          location.reload();
        }
      });
    } catch (e) {
      console.error(e);
    }
  }

  const [postId, setPostId] = useState('')
  const laporKan = async () => {
    if (postId === '') return alert('silakan pilih postingan yang ingin di laporkan.')

    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("reason", "Ujaran kebencian");

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/postingan/${postId}/report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: urlEncodedData.toString(),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error(data);
        Swal.fire({
          title: "Gagal Melaporkan Postingan",
          text: "Terjadi kesalahan saat menghubungi server.",
          icon: "error",
        });
        return;
      }

      const data = await res.json();
      console.log(data);

      Swal.fire({
        title: "Berhasil Melaporkan Postingan.",
        text: "Postingan telah di laporkan.",
        icon: "success",
      }).then((res) => {
        if (res.isConfirmed) {
          location.reload();
        }
      });
    } catch (e) {
      console.error(e);
    }

  }
  
  const extractHashtags = (text: string) => {
    const hashtagRegex = /#\w+/g;
    return text.match(hashtagRegex) || [];
  };

  const removeHashtags = (text: string) => {
    return text.replace(/#\w+/g, '').trim();
  };

  const parseLikes = (likes: any) => {
  try {
    // Jika likes sudah berupa array, langsung return
    if (Array.isArray(likes)) return likes;
    
    // Jika likes adalah string, coba parse
    if (typeof likes === 'string') {
      // Handle kasus khusus dimana string sudah berupa array (tanpa perlu parse)
      if (likes.startsWith('[') && likes.endsWith(']')) {
        return JSON.parse(likes);
      }
      // Format alternatif: "1831" atau "1831, 1832"
      return likes.split(',').map(id => {
        const num = parseInt(id.trim(), 10);
        return isNaN(num) ? id.trim() : num;
      });
    }
    
    // Fallback untuk tipe data tidak dikenali
    return [];
  } catch (e) {
    console.error('Gagal parsing likes:', e);
    return [];
  }
};

// Penggunaan:
const parsedLikes = parseLikes(post?.likers);
console.log(parsedLikes)
  return (
    <>
      <div className="bg-gray-100 border border-gray-300 dark:border-gray-600 dark:bg-tertiaryDark p-4 rounded-lg">
        <div className="flex items-center gap-3 mb-2">
          <img
            src={post?.user?.avatar ?? "https://i.pinimg.com/736x/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm md:text-base">@{post?.user?.username ?? "Unknown"}</p>
            <span className="text-sm text-textBody dark:text-textBodyDark">{formattedDate}</span>
          </div>
        </div>
        {
          post.type === 'image' ? (
            <img src={post.image} className="w-50 rounded-sm" alt="" />
          ) : ''
        }
        <p className="text-xs md:text-base mb-3">{removeHashtags(post.content)}</p>
        
        {/* Tambahkan ini untuk menampilkan hashtag */}
        {extractHashtags(post.content).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {extractHashtags(post.content).map((hashtag, index) => (
              <span key={index} className="font-bold text-primary dark:text-primaryDark">
                {hashtag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between text-textBody dark:text-textBodyDark text-sm z-10">
          <div className="flex gap-6">
            <button
              className={`flex items-center gap-1 hover:text-accent hover:cursor-pointer ${
                parsedLikes.some((like: any) => like.user_id === decodedToken.user_id) 
                  ? "text-red-400" 
                  : ""
              }`}
              onClick={() => handleLike(post.id)}
            >
              <ThumbsUp size={18} /> {post.like_count}
            </button>
            <button
              className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
              onClick={() => setShowComments((prev) => !prev)}
            >
              <MessageCircle size={18} /> {post.comment_count}
            </button>
            <div className="relative inline-block">
              <button
                ref={shareButtonRef}
                className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
                onClick={() => setShowSharePopup(prev => !prev)}
              >
                <div className="flex mt-1">
                  <Share2 size={18} />
                </div>
                <span className="hidden md:block">Bagikan</span>
              </button>

              <AnimatePresence>
                {showSharePopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-background dark:bg-backgroundDark shadow-md rounded-md px-4 py-2 z-50"
                  >
                    <div className="flex gap-4 items-center">
                      <button
                        onClick={() => handlePlatformShare("whatsapp")}
                        title="WhatsApp"
                        className="600 hover:scale-110 transition-transform"
                      >
                        <MessageCircleMore size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("facebook")}
                        title="Facebook"
                        className="00 hover:scale-110 transition-transform"
                      >
                        <Facebook size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("twitter")}
                        title="X"
                        className="hover:scale-110 transition-transform"
                      >
                        <Twitter size={24} />
                      </button>
                      <button
                        onClick={() => handlePlatformShare("instagram")}
                        title="Instagram"
                        className="00 hover:scale-110 transition-transform"
                      >
                        <Instagram size={24} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
          <div className="flex justify-end">
            <button
              className="flex items-center gap-1 hover:text-accent hover:cursor-pointer"
              onClick={() => setPostId(post.id.toString())}
            >
              <Flag size={18} /> Laporkan
            </button>
          </div>
          <div className={`w-full h-screen fixed start-0 top-0 ${postId !== "" ? 'flex' : "hidden"} items-center justify-center`} style={{background: "rgba(0,0,0,.2)", zIndex: '999'}}>
            <div className="flex w-[300px] container px-3 h-auto py-10 rounded-2xl bg-gray-300 dark:bg-gray-800 flex-col">
              <div className="flex justify-between items-center">
                <h1 className="font-bold">Laporkan Postingan</h1>
                <X onClick={() => setPostId('')} />
              </div>
                <div className="flex flex-col gap-2 mt-5">
                  <div className="w-full flex gap-2 items-center h-auto p-3 rounded-md bg-gray-700">
                    <Circle size={15} />
                    <span>
                      Ujaran kebencian
                    </span>
                  </div>
                  <button className="w-full py-3 mt-3 rounded-md bg-primary" onClick={() => laporKan()}>
                    Laporkan
                  </button>
                </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-4 rounded-xl p-4 flex flex-col gap-4  dark:border-gray-700"
            >
              {/* Komentar yang ada */}
              {post.comments.map((comment: any) => (
                <Comment key={comment.id} postingan={post} comment={comment} handleReply={handleReplySecondary} />
              ))}

              {/* Input Komentar */}
              <div className="flex flex-col gap-3 border-t pt-4 dark:border-gray-700 flex-wrap sm:flex-nowrap">
                {
                  replyToUser && (
                    <div className="pb-2 flex justify-between">
                      <div>
                        Balasan Untuk @{replyToUser}
                      </div>
                      <div onClick={() => setReplyToUser('')} className="cursor-pointer">
                        <X />
                      </div>
                    </div>
                  )
                }
                <div className="flex gap-3 w-full">
                  <img
                    src="https://i.pravatar.cc/40"
                    alt="avatar"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-sm text-gray-900 dark:text-white p-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
                    placeholder="Tulis komentarmu..."
                    name="commentContent"
                    id="commentContent"
                  />
                  <button
                    type="button"
                    onClick={() => handleComment(post.id)}
                    className="text-primary hover:text-blue-700 cursor-pointer dark:hover:text-blue-400"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div >
    </>
  );
}

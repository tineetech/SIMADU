import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { ArrowLeft } from 'lucide-react';
import { ArticleInterface1, fetchArticles, PopularArticleInterface, fetchPopularArticles } from "../services/getArtikel";

// Define interface for the complex article structure from JSON
interface ComplexArticleInterface {
  mainHeadline: {
    title: string;
    url: string;
    image: string;
    category: string;
    details: {
      title: string;
      content: string;
      author: string;
      editor: string;
      publishedDate: string;
      tags: string[];
      media: {
        images: any[];
        videos: any[];
      };
      sourceUrl: string;
    };
  };
  secondaryHeadlines?: any[];
}

// Fetch news data based on URL
const fetchNewsData = async (url?: string): Promise<ComplexArticleInterface> => {
  try {
    // If no URL is provided, use a default endpoint
    const endpoint = url 
      ? `${import.meta.env.VITE_ARTIKEL_SERVICE}/api/berita/scrape?url=${encodeURIComponent(url)}` 
      : `${import.meta.env.VITE_ARTIKEL_SERVICE}/api/berita`;
    
    const response = await fetch(endpoint); 
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data');
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching news:", error);
    
    // Fallback to mock data if fetch fails
    // This is for development/testing purposes
    return {
      mainHeadline: {
        title: "Sisa Ledakan Amunisi yang Tewaskan 13 Orang Disimpan di Belakang Rumah Warga Garut",
        url: "https://bandung.kompas.com/read/2025/05/13/153741578/sisa-ledakan-amunisi-yang-tewaskan-13-orang-disimpan-di-belakang-rumah-warga?source=headline",
        image: "https://asset.kompas.com/crops/p7Y4SXynXvJXM11meaP2k_dhc9w=/0x0:0x0/740x500/data/photo/2025/05/13/682302a25d595.jpg",
        category: "Headline",
        details: {
          title: "Sisa Ledakan Amunisi yang Tewaskan 13 Orang Disimpan di Belakang Rumah Warga Garut",
          content: "GARUT, KOMPAS.com - Tumpukan bongkahan bungkus amunisi sisa ledakan amunisi yang menewaskan 13 orang diketahui disembunyikan di belakang rumah warga tak jauh dari lokasi di Desa Sagara, Kecamatan Cibalong, Kabupaten Garut, Jawa Barat.\n\nPantauan Kompas.com di lokasi, tumpukan bungkus amunisi tersebut masih utuh dan menumpuk di belakang rumah warga, sekaligus di depan sebuah warung berjarak sekitar 200 meter dari lokasi ledakan.\n\nTulisan \"amunisi\" dan \"mudah meledak\" tertera di bungkus besi berwarna hijau tua yang tak dijaga satu pun oleh anggota TNI dan Polri.\n\nBaca juga:\n\nTumpukan bekas bungkus amunisi tersebut seperti sengaja dijauhkan dari lokasi ke belakang rumah warga untuk disembunyikan usai tragedi meledak amunisi yang menewaskan belasan orang.\n\n\"Ini disimpan saja, tidak disembunyikan. Ini hanya sisa bungkus mortir saja,\" kata Parman (56), salah satu warga sekitar, Selasa (13/5/2025).\n\nKompas.com pun berhasil mengabadikan momen tumpukan bekas bungkus amunisi tersebut yang dalamnya sudah kosong.\n\nAdapun lokasi tumpukan bekas amunisi tersebut dalam kondisi sepi, dan bangunan warung di depannya pun masih dalam keadaan tutup.\n\nSementara itu, lokasi kejadian yang berjarak sekitar 500 meter dari Jalan Nasional wilayah perbukitan Gunung Sancang masih dijaga ketat oleh petugas Brimob bersenjata laras panjang dan anggota TNI.\n\nLokasi tersebut berjarak belasan kilometer dari pusat Pantai Pameumpeuk, Garut Selatan, yang terletak di wilayah kaki Gunung Sancang, Jalan Nasional Pantai Selatan Jawa Barat antara Cipatujah, Tasikmalaya-Pameumpeuk, Garut.\n\nDari pinggir jalan sekitar lokasi terlihat bendera merah dan plang merah bertuliskan \"Dilarang Masuk Daerah Penghancuran Amunisi Akhir Gupusmu III\" lengkap dengan gambar tengkorak.\n\nSaat Kompas.com mencoba masuk dan memotret lokasi kejadian, beberapa petugas TNI dan Brimob langsung melarang dengan alasan masih lokasi penyelidikan.\n\nDiberitakan sebelumnya, ledakan terjadi saat pemusnahan amunisi kedaluwarsa TNI AD di Desa Sagara, Kecamatan Cibalong, Kabupaten Garut pada Senin (12/5/2025) pagi.\n\nBaca juga:\n\nKejadian itu menewaskan 13 orang, terdiri dari 4 anggota TNI dan 9 orang warga sipil asal daerah setempat.\n\nLedakan diduga akibat detonator penghancur yang dipasang untuk meledakan amunisi tersebut meledak lebih dulu saat masih dipasang di sebuah lubang besar penghancur dekat pesisir pantai.",
          author: "",
          editor: "",
          publishedDate: "Kompas.com - 13/05/2025, 15:37 WIB",
          tags: [
            "tragedi",
            "Garut",
            "Ledakan Amunisi",
            "tumpukan bungkus amunisi"
          ],
          media: {
            images: [],
            videos: []
          },
          sourceUrl: "https://bandung.kompas.com/read/2025/05/13/153741578/sisa-ledakan-amunisi-yang-tewaskan-13-orang-disimpan-di-belakang-rumah-warga?source=headline"
        }
      }
    };
  }
};

export default function ArticleDetailPage() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const newsUrl = searchParams.get('url');
    
    const [article, setArticle] = useState<ArticleInterface1 | PopularArticleInterface | ComplexArticleInterface | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getArticleDetail = async () => {
            try {
                setLoading(true);
                
                // Check if we have a news URL parameter - this takes highest priority
                if (newsUrl) {
                    try {
                        const newsData = await fetchNewsData(newsUrl);
                        setArticle(newsData);
                        return;
                    } catch (error) {
                        console.error("Error fetching news data from URL:", error);
                        // Continue to try other methods
                    }
                }
                
                // Check if ID is a number or a string like "news"
                if (id && isNaN(Number(id))) {
                    // Handle special case for news data
                    if (id === "news") {
                        try {
                            const newsData = await fetchNewsData();
                            setArticle(newsData);
                            return;
                        } catch (error) {
                            console.error("Error fetching news data:", error);
                            // Continue to try other methods
                        }
                    }
                }
                
                // If id is a number, try to fetch regular or popular articles
                if (id && !isNaN(Number(id))) {
                    // Try to fetch from regular articles first
                    try {
                        const articles = await fetchArticles();
                        let foundArticle = articles.find(a => a.id === Number(id));
                        
                        if (foundArticle) {
                            setArticle(foundArticle);
                            return;
                        }
                        
                        // If not found in regular articles, try popular articles
                        const popularResponse = await fetchPopularArticles();
                        foundArticle = popularResponse.data.find(a => a.rank === Number(id));
                        
                        if (foundArticle) {
                            setArticle(foundArticle);
                            return;
                        }
                        
                        // If we reach here, nothing was found
                        setError("Artikel tidak ditemukan");
                    } catch (err) {
                        console.error("Error fetching articles:", err);
                        setError("Terjadi kesalahan saat memuat artikel");
                    }
                } else {
                    setLoading(false);
                }
                
            } catch (err) {
                console.error("Error fetching article:", err);
                setError("Terjadi kesalahan saat memuat artikel");
                setLoading(false);
            }
        };

        getArticleDetail();
    }, [id, newsUrl]);

    if (loading) {
        return (
            <section className="min-h-screen pt-20 px-4 bg-background dark:bg-backgroundDark">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-text dark:text-textDark">Memuat artikel...</p>
                </div>
            </section>
        );
    }

    if (error || !article) {
        return (
            <section className="min-h-screen pt-20 px-4 bg-background dark:bg-backgroundDark">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-xl md:text-2xl font-semibold text-text dark:text-textDark">{error || "Artikel tidak ditemukan"}</h1>
                    <Link to="/artikel" className="text-accent dark:text-accentDark underline mt-4 block">← Kembali ke Artikel</Link>
                </div>
            </section>
        );
    }

    // Check if we have a complex article structure
    const isComplexArticle = 'mainHeadline' in article;
    
    // Handle the complex article structure
    if (isComplexArticle) {
        const complexArticle = article as ComplexArticleInterface;
        const { mainHeadline } = complexArticle;
        
        return (
            <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
                <div className="container mx-auto max-w-3xl px-4 md:px-0 py-24">
                    <div className="bg-tertiary dark:bg-tertiaryDark p-6 md:p-8 rounded-xl">
                        {mainHeadline.image && (
                            <img
                                src={mainHeadline.image}
                                alt={mainHeadline.title}
                                className="w-full h-48 md:h-60 object-cover rounded-lg mb-6"
                            />
                        )}
                        <h1 className="text-2xl md:text-3xl font-bold mb-4">{mainHeadline.title}</h1>
                        
                        {mainHeadline.category && (
                            <div className="mb-4">
                                <span className="inline-block bg-accent/10 text-accent dark:bg-accentDark/20 dark:text-accentDark text-sm px-3 py-1 rounded-full">
                                    {mainHeadline.category}
                                </span>
                                {mainHeadline.details.publishedDate && (
                                    <span className="text-sm text-textBody dark:text-textBodyDark ml-2">
                                        {mainHeadline.details.publishedDate}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {mainHeadline.details.content && (
                            <div className="text-textBody dark:text-textBodyDark text-sm md:text-base whitespace-pre-line">
                                {mainHeadline.details.content}
                            </div>
                        )}
                        
                        {/* Display tags if available */}
                        {mainHeadline.details.tags && mainHeadline.details.tags.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-sm font-semibold mb-2">Tags:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {mainHeadline.details.tags.map((tag, index) => (
                                        <span key={index} className="bg-secondary/50 dark:bg-secondaryDark/50 px-2 py-1 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {mainHeadline.url && (
                            <a 
                                href={mainHeadline.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-6 bg-secondary dark:bg-secondaryDark text-text dark:text-textDark px-3 py-1.5 rounded-lg text-sm md:text-base hover:opacity-80 transition-all duration-200"
                            >
                                Baca Selengkapnya
                            </a>
                        )}
                        
                        <Link
                            to="/artikel"
                            className="inline-flex items-center gap-2 mt-8 bg-accent dark:bg-accentDark text-textDark px-3 py-1.5 rounded-lg text-sm md:text-base hover:bg-indigo-700 transition-all duration-200"
                        >
                            <ArrowLeft size={18} />
                            Kembali ke Artikel
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    // Determine if we have a regular article (with 'id' property) or popular article (with 'rank' property)
    const isRegularArticle = 'id' in article;
    
    // Get image based on article type
    const articleImage = article.image || '';
    
    // Get title based on article type
    const articleTitle = article.title || '';
    
    // Get content based on article type (regular articles have content, popular articles may not)
    const articleContent = 'content' in article ? article.content : '';

    // Get category and date for articles
    const articleCategory = article.category || '';
    const articleDate = 'date' in article ? article.date : '';

    return (
        <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
            <div className="container mx-auto max-w-3xl px-4 md:px-0 py-24">
                <div className="bg-tertiary dark:bg-tertiaryDark p-6 md:p-8 rounded-xl">
                    {articleImage && (
                        <img
                            src={articleImage}
                            alt={articleTitle}
                            className="w-full h-48 md:h-60 object-cover rounded-lg mb-6"
                        />
                    )}
                    <h1 className="text-2xl md:text-3xl font-bold mb-4">{articleTitle}</h1>
                    
                    {/* Show category and date if available */}
                    {articleCategory && (
                        <div className="mb-4">
                            <span className="inline-block bg-accent/10 text-accent dark:bg-accentDark/20 dark:text-accentDark text-sm px-3 py-1 rounded-full">
                                {articleCategory}
                            </span>
                            {articleDate && (
                                <span className="text-sm text-textBody dark:text-textBodyDark ml-2">
                                    {articleDate}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {/* Display article content */}
                    {articleContent && (
                        <div className="text-textBody dark:text-textBodyDark text-sm md:text-base whitespace-pre-line">
                            {articleContent}
                        </div>
                    )}
                    
                    {/* Display additional fields for popular articles */}
                    {!isRegularArticle && (
                        <div className="mt-4 text-textBody dark:text-textBodyDark">
                            {/* Display any other relevant fields for popular articles */}
                            {'scrapedAt' in article && article.scrapedAt && (
                                <p className="text-sm text-textBody dark:text-textBodyDark mt-2">
                                    <strong>Di-scrape pada:</strong> {article.scrapedAt}
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* If article has a URL, add a "Read More" link */}
                    {'url' in article && article.url && (
                        <a 
                            href={article.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mt-6 bg-secondary dark:bg-secondaryDark text-text dark:text-textDark px-3 py-1.5 rounded-lg text-sm md:text-base hover:opacity-80 transition-all duration-200"
                        >
                            Baca Selengkapnya
                        </a>
                    )}
                    
                    <Link
                        to="/artikel"
                        className="inline-flex items-center gap-2 mt-8 bg-accent dark:bg-accentDark text-textDark px-3 py-1.5 rounded-lg text-sm md:text-base hover:bg-indigo-700 transition-all duration-200"
                    >
                        <ArrowLeft size={18} />
                        Kembali ke Artikel
                    </Link>
                </div>
            </div>
        </section>
    );
}
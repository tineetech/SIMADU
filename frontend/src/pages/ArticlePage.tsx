import { useState, useEffect } from "react";
import SearchBar from "../components/widgets/SearchBar";
import ArticleCard from "../components/cards/ArticleCard";
import { fetchArticles } from "../services/getArtikel.tsx";

interface ScrapedArticle {
  title: string;
  url: string;
  image: string;
  category?: string;
}

export default function ArticlePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState<ScrapedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const data = await fetchArticles();
        const allArticles = [data.mainHeadline, ...data.secondaryHeadlines];
        setArticles(allArticles);
      } catch (err) {
        setError("Failed to load articles. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
        <div className="container mx-auto py-35 px-4 md:px-20">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
        <div className="container mx-auto pt-35 px-4 md:px-20">
          <div className="flex justify-center items-center h-screen">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background dark:bg-backgroundDark text-text dark:text-textDark">
      <div className="container mx-auto pt-35 px-4 md:px-20">
        <div
          className="grid gap-4 mb-20
          grid-cols-2
          md:grid-cols-4 md:grid-rows-3 md:h-[600px]"
          style={{
            gridTemplateAreas:
              typeof window !== "undefined" && window.innerWidth >= 768
                ? `
              "a a b c"
              "a a g c"
              "d e g f"
            `
                : undefined,
          }}
        >
          <div className="bg-[url('/images/earth.webp')] bg-cover bg-center rounded-xl p-6 flex flex-col justify-between col-span-2 md:[grid-area:a] text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-md">
              Jelajahi Artikel Terupdate!
            </h1>
            <p className="font-bold drop-shadow-md">
              Berita Seputar Indonesia dan Dunia Hari Ini🌏
            </p>
          </div>

          {articles.length > 0 && articles[0]?.image && (
            <>
              <ArticleThumbnail article={articles[1]} gridArea="b" />
              <ArticleThumbnail article={articles[2]} gridArea="c" />
              <ArticleThumbnail article={articles[3]} gridArea="d" />
              <ArticleThumbnail article={articles[4]} gridArea="e" />
              <ArticleThumbnail article={articles[5]} gridArea="e" />
            </>
          )}

          <div className="relative bg-[url('/images/pemlik.avif')] rounded-xl   p-4 flex items-center justify-center text-center md:[grid-area:g]">
            <p className="absolute bottom-4 left-4 font-bold drop-shadow-md text-left">
              🌱 Edukasi berkelanjutan
            </p>
          </div>

          <div
            className="bg-tertiary dark:bg-tertiaryDark rounded-xl p-4 flex items-center justify-center text-center md:[grid-area:f]"
            style={{
              backgroundImage: `url('/images/latbak.png')`,
              backgroundColor: "var(--tertiary)",
            }}
          >
            <span className="text-textBody dark:text-textBodyDark">
              Lebih banyak artikel segera hadir...
            </span>
          </div>
        </div>

        <div className="flex items-center mb-8">
          <h2 className="text-3xl font-semibold mb-4">
            Mulai perjalanan literasimu hari ini!
          </h2>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeHolder="Cari artikel..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-20">
          {filteredArticles.map((article, index) => (
            <ArticleCard
              key={index}
              article={{
                id: index,
                title: article.title,
                image: article.image,
                description: article.category || "News Article",
                content: "",
                url: article.url,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleThumbnail({
  article,
  gridArea,
}: {
  article: ScrapedArticle;
  gridArea: string;
}) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        hidden md:block
        rounded-xl
        md:[grid-area:${gridArea}]
        group relative overflow-hidden
      `}
      style={{
        backgroundImage: `url('${article.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "var(--tertiary)",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>

      <div className="relative z-10 flex flex-col justify-end h-full p-4">
        <h2 className="font-semibold text-lg mb-1 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {article.title}
        </h2>
        <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {article.category}
        </p>
      </div>
    </a>
  );
}

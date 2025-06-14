import axios from "axios";
import * as cheerio from "cheerio";

// Helper function to get article details
const getArticleDetails = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Scrape judul artikel
    const title = $(".read__title").text().trim();

    // Scrape konten utama dengan pembersihan
    let content = "";
    $(".read__content p").each((i, el) => {
      const paragraph = $(el);

      paragraph
        .find("iframe, script, .ads-on-body, .inner-link-baca-juga, .video")
        .remove();

      let text = paragraph.text().trim();

      text = text.replace(/Baca juga:.+/g, "");

      if (text.length > 0) {
        content += text + "\n\n";
      }
    });

    // Scrape metadata
    const author = $(".read_author_name").text().trim();
    const editor = $(".read_author_editor")
      .text()
      .replace("Editor:", "")
      .trim();
    const publishedDate = $(".read__time").text().trim();

    // Scrape tag terkait (tanpa duplikat)
    const tags = [
      ...new Set(
        $(".tag_article_item")
          .map((i, el) => $(el).text().trim())
          .get()
      ),
    ];

    // Scrape gambar dalam konten
    const images = $(".read__content img")
      .map((i, el) => ({
        src: $(el).attr("src") || $(el).attr("data-src"),
        alt: $(el).attr("alt") || "",
      }))
      .get();

    // Scrape video embed jika ada
    const videos = $(".read__content iframe")
      .map((i, el) => ({
        src: $(el).attr("src"),
        type: $(el).attr("src")?.includes("youtube") ? "youtube" : "other",
      }))
      .get();

    return {
      title,
      content: content.trim(),
      author,
      editor,
      publishedDate,
      tags,
      media: {
        images,
        videos,
      },
      sourceUrl: url,
    };
  } catch (error) {
    // console.error(`Error scraping article from ${url}:`, error);
    return null;
  }
};

// Fungsi untuk mendapatkan artikel populer
export const getArticlePopuler = async (req, res) => {
  try {
    // URL indeks berita terpopuler Kompas
    const url = "https://indeks.kompas.com/terpopuler/?site=all";
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
    });

    const $ = cheerio.load(response.data);

    // Scrape tanggal pemilihan
    const selectedDate =
      $("#date_values").attr("data-value") || $("#date_values").val();

    // Scrape daftar berita terpopuler
    const popularNews = [];
    $(".articleList.-list .articleItem").each((index, element) => {
      const article = $(element);
      const title = article.find(".articleTitle").text().trim();
      const url = article.find("a.article-link").attr("href");
      const image = article.find(".articleItem-img img").attr("src");
      const category = article.find(".articlePost-subtitle").text().trim();
      const date = article.find(".articlePost-date").text().trim();

      if (title && url) {
        popularNews.push({
          rank: index + 1,
          title,
          url,
          image,
          category,
          date,
          scrapedAt: new Date().toISOString(),
        });
      }
    });

    res.json({
      success: true,
      date: selectedDate,
      data: popularNews,
      count: popularNews.length,
      source: "Kompas Terpopuler",
    });
  } catch (error) {
    // console.error("Error scraping popular news:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape popular news",
      details: error.message,
    });
  }
};

export const scrapeDataWithDetails = async (req, res) => {
  try {
    const response = await axios.get("https://www.kompas.com", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        Referer: "https://www.google.com/",
      },
    });

    const $ = cheerio.load(response.data);

    const mainHeadlineUrl = $(".hlItem a").first().attr("href");
    const mainHeadline = {
      title: $(".hlItem .hlTitle").first().text().trim(),
      url: mainHeadlineUrl,
      image:
        $(".hlItem img").first().attr("src") ||
        $(".hlItem img").first().attr("data-src"),
      category: $(".hlItem .hlSubtitle").first().text().trim(),
      details: await getArticleDetails(mainHeadlineUrl),
    };

    // Scrape headline sekunder
    const secondaryHeadlinesPromises = $(".hlWrap-grid .hlItem")
      .map(async (index, element) => {
        const url = $(element).find("a").attr("href");
        const item = {
          title: $(element).find(".hlTitle").text().trim(),
          url,
          image:
            $(element).find("img").attr("src") ||
            $(element).find("img").attr("data-src"),
          category: $(element).find(".hlChannel").text().trim(),
          details: await getArticleDetails(url),
        };
        return item.title && item.url ? item : null;
      })
      .get();

    const secondaryHeadlines = (
      await Promise.all(secondaryHeadlinesPromises)
    ).filter((item) => item !== null);

    // Scrape trending news (tidak perlu detail karena biasanya halaman tag)
    const trendingNews = $(".trendItem")
      .map((index, element) => {
        const item = {
          title: $(element).find(".trendTitle a").text().trim(),
          url: $(element).find(".trendTitle a").attr("href"),
          rank: index + 1,
        };
        return item.title && item.url ? item : null;
      })
      .get()
      .filter((item) => item !== null);

    res.json({
      mainHeadline,
      secondaryHeadlines,
      trendingNews,
      scrapedAt: new Date().toISOString(),
    });
  } catch (error) {
    // console.error("Scraping error:", error);
    res.status(500).json({
      error: "Error scraping Kompas headlines with details",
      details: error.message,
    });
  }
};
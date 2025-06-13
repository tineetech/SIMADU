// src/services/getArtikel.ts
import axios from 'axios';

export interface ArticleInterface1 {
  id: number;
  title: string;
  image: string;
  content: string;
  url?: string;
  category?: string;
}

export interface PopularArticleInterface {
  rank: number;
  title: string;
  url: string;
  image: string;
  category: string;
  date: string;
  scrapedAt: string;
}

export interface PopularArticlesResponse {
  success: boolean;
  date: string;
  data: PopularArticleInterface[];
  count: number;
  source: string;
}

const API_BASE_URL = import.meta.env.VITE_ARTIKEL_SERVICE;

export const fetchArticles = async (): Promise<ArticleInterface1[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/berita/scrape`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }
};

export const fetchPopularArticles = async (): Promise<PopularArticlesResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/berita/scrape/populer`);
    
    // Format the date to match your example (e.g., "13 May 2025")
    const formattedDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    return {
      success: true,
      date: formattedDate,
      data: response.data,
      count: response.data.length,
      source: "Kompas Terpopuler"
    };
  } catch (error) {
    console.error('Error fetching popular articles:', error);
    throw error;
  }
};

// Alternative implementation if you need to scrape directly from Kompas
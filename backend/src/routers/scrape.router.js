import { Router } from 'express';
import { scrapeDataWithDetails, getArticlePopuler } from '../controllers/scrape.controller.js';

export class ScrapeRouter {
  router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('/scrape', scrapeDataWithDetails);

    this.router.get('/scrape/populer', getArticlePopuler);    

    // this.router.get('/scrape/sorotan', getSorotanFromHTML);
  }

  getRouter() {
    return this.router;
  }
}

import { ArticleInterface } from "../../types";

interface Props {
  article: ArticleInterface;
}

export default function ArticleCard({ article }: Props) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-tertiary dark:bg-tertiaryDark rounded-xl overflow-hidden hover:scale-[1.02] transition block"
    >
      <img
        src={article.image}
        alt={article.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold">{article.title}</h2>
        <p className="text-textBody dark:text-textBodyDark text-sm mt-2 line-clamp-3">
          {article.description}
        </p>
      </div>
    </a>
  );
}

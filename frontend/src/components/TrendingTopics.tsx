export default function TrendingTopics({ posts }) {
  const extractHashtags = (text: string) => {
    return text.match(/#\w+/g) || [];
  };

  console.log(posts);
  const getPopularHashtags = (posts: any[], limit = 10) => {
    // Hitung frekuensi setiap hashtag
    const hashtagCounts = posts?.flatMap(post =>
      extractHashtags(post.content ?? '')
    )?.reduce((acc, hashtag) => {
      acc[hashtag] = (acc[hashtag] || 0) + 1;
      return acc;
    }, {});

    // Urutkan berdasarkan popularity (yang paling banyak muncul)
    return Object.entries(hashtagCounts || {}) // Tambahkan fallback object kosong
      .sort((a, b) => b[1] - a[1]) // Urut descending
      .slice(0, limit) // Ambil top 10
      .map(([hashtag]) => hashtag); // Hanya ambil nama hashtag
  };

  const popularHashtags = getPopularHashtags(posts);

  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold mb-2">Tren Topik</h2>
      <div className="flex flex-wrap gap-2">
        {popularHashtags.length > 0 ? (
          popularHashtags.map((hashtag) => (
            <span
              key={hashtag}
              className="text-sm bg-tertiary dark:bg-tertiaryDark px-3 py-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
              onClick={() => console.log(`Search for ${hashtag}`)} // Tambahkan fungsi pencarian
            >
              {hashtag}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-500">Tidak ada tren topik</p>
        )}
      </div>
    </div>
  );
}
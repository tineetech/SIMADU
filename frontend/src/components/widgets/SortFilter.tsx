interface SortFilterProps {
    sortBy: string;
    setSortBy: (value: string) => void;
}

export default function SortFilter({ sortBy, setSortBy }: SortFilterProps) {
    return (
        <div className="flex gap-4 mb-4 text-sm">
            {["terbaru", "populer"].map((type) => (
                <button
                    key={type}
                    onClick={() => setSortBy(type)}
                    className={`capitalize px-3 py-1 rounded-full transition ${sortBy === type ? "bg-accent text-textDark dark:bg-accentDark" : "bg-tertiary text-textBody dark:bg-tertiaryDark dark:text-textBodyDark"
                        }`}
                >
                    {type}
                </button>
            ))}
        </div>
    );
}

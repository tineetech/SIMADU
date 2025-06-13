type OptionFilterProps = {
    options: string[];
    selected: string;
    onChange: (value: string) => void;
};

export default function OptionFilter({ options, selected, onChange }: OptionFilterProps) {
    return (
        <div className="flex gap-4 items-center">
            {options.map((option) => (
                <button
                    key={option}
                    className={`font-medium ${selected === option ? "" : "text-textBody/70 dark:text-textBody hover:text-text dark:hover:text-textDark transition-all ease-in-out cursor-pointer"}`}
                    onClick={() => onChange(option)}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}

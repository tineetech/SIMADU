import { motion } from "framer-motion";

interface SelectStatusFilterProps {
    value: string;
    onChange: (value: string) => void;
    options: { label: string; value: string }[];
}

export default function SelectCategoryFilter({ value, onChange, options }: SelectStatusFilterProps) {
    return (
        <motion.select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-2 rounded-md text-sm bg-tertiary dark:bg-tertiaryDark"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileFocus={{ scale: 1.02 }}
        >
            {options.map((opt) => (
                <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-tertiary dark:bg-tertiaryDark shadow-md"
                >
                    {opt.label}
                </option>
            ))}
        </motion.select>
    );
}

import CoinExchangeForm from "../components/forms/CoinsExchangeForm";

export default function CoinExchangePage() {
    return (
        <div className="min-h-screen bg-background dark:bg-backgroundDark text-text dark:text-textDark px-4 py-10">
            <h1 className="text-2xl font-bold text-center mt-24">Penukaran Koin</h1>
            <CoinExchangeForm />
        </div>
    );
}

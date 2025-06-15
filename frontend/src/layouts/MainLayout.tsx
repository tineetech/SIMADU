import Header from "../components/navigations/Header";
import Footer from "../components/navigations/Footer";
import { Outlet } from "react-router-dom";
import SimaduAI from "../components/SimaduAI";

export default function MainLayout() {
    return (
        <div className="bg-background dark:bg-backgroundDark">
            <SimaduAI />
            <Header />
                <main>
                    <Outlet />
                </main>
            <Footer />
        </div>
    );
}

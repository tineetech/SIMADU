import Header from "../components/navigations/Header";
import Footer from "../components/navigations/Footer";
import { Outlet } from "react-router-dom";
import SikuyAi from "../components/SikuyAi";

export default function MainLayout() {
    return (
        <div className="bg-background dark:bg-backgroundDark">
            <SikuyAi />
            <Header />
                <main>
                    <Outlet />
                </main>
            <Footer />
            {/* <ChatBot /> */}
        </div>
    );
}

import Hero from "../components/HomeSections/Hero";
import Features from "../components/HomeSections/Features";
import About from "../components/HomeSections/About";
import Contact from "../components/HomeSections/Contact";
import Features2 from "../components/HomeSections/Features2";

export default function HomePage() {

	return (
		<div className=" bg-background text-text dark:bg-backgroundDark dark:text-textDark">
			<Hero />
			<div className="container mx-auto">
				<About />
				<Features />
				<Features2 />
				<Contact />
			</div>
		</div>
	);
}

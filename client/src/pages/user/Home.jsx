import { Plus, Minus } from "lucide-react";
import Navbar from "../../components/Navbar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
// --- Data Constants ---

const CATEGORIES = [
    {
        name: "Necklace",
        image: "asset/Necklace.png",
    },
    {
        name: "Earrings",
        image: "asset/Earrings.png",
    },
    {
        name: "Bracelets",
        image: "asset/Bracelets.png",
    },
    {
        name: "Rings",
        image: "asset/Rings.png",
    },
    {
        name: "Charms",
        image: "asset/Charms.png",
    },
];

const FEATURED_PRODUCTS = [
    {
        name: "Mini Hoops",
        price: "$40.00",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a51?q=80&w=500&auto=format&fit=crop",
    },
    {
        name: "Textured Ring",
        price: "$45.00",
        image: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=500&auto=format&fit=crop",
    },
    {
        name: "Diamond Chain",
        price: "$85.00",
        image: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=500&auto=format&fit=crop",
    },
    {
        name: "Globe Charm",
        price: "$60.00",
        image: "https://images.unsplash.com/photo-1602751584552-8ba420552259?q=80&w=500&auto=format&fit=crop",
    },
    {
        name: "Leafy Looper",
        price: "$55.00",
        image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?q=80&w=500&auto=format&fit=crop",
    },
];

const FAQS = [
    {
        question: "Are your products certified and of high quality?",
        answer: "Yes, all our products are crafted with the highest quality materials and undergo thorough quality checks. We also provide certificates of authenticity for our diamond and gemstone jewelry.",
    },
    {
        question: "Can I choose my preferred metal or gemstone?",
        answer: "Absolutely. Many of our pieces are customizable. You can select from various metals like gold, silver, or platinum, and choose your preferred gemstones.",
    },
    {
        question: "How do I determine my ring size for online purchases?",
        answer: "We provide a printable ring size guide on our website. Alternatively, you can visit a local jeweler to get your finger sized professionally.",
    },
    {
        question: "Do you offer customization options for jewelry?",
        answer: "Yes, we specialize in bespoke jewelry. Contact our support team to start your custom design journey.",
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, PayPal, and financing options through Affirm.",
    },
    {
        question: "Do you offer international shipping?",
        answer: "Yes, we ship globally. Shipping rates and times vary depending on the destination.",
    },
];

// --- Main Page Component ---

const HomePage = () => {
    const accessToken = useSelector((state) => state.user);
    console.log(accessToken);
    return (
        <>
            <div className="w-full bg-white font-sans text-gray-900">
                <Navbar homePage={true} />
                {/* 1. Hero Section */}
                <section className="relative h-screen w-full">
                    {/* Background Video */}
                    <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
                        <source src="/asset/promovideo (2) - Trim.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Overlay gradient for text readability */}
                    <div className="absolute inset-0 bg-black/30 md:bg-black/20"></div>

                    {/* Hero Content */}
                    <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center text-white">
                        <div className="max-w-xl mt-20 md:mt-20">
                            <h1 className="font-cormorant text-5xl md:text-7xl font-normal mb-4 leading-tight">
                                Golden Memory
                            </h1>
                            <div className="w-24 h-1 bg-blue-500 mb-6"></div>
                            <p className="text-base font-karla md:text-lg mb-8 max-w-md font-semibold tracking-wide text-white/90">
                                Indulge in the opulence of Golden Memory, a mesmerizing jewelry collection fit for a queen.
                            </p>
                            <Button className="px-8 py-3 border bg-transparent border-white text-white uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition duration-300">
                                Shop Now
                            </Button>
                        </div>
                    </div>
                </section>
                {/* 2. Shop by Category */}
                <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-cormorant text-3xl md:text-4xl text-gray-900 mb-2">Shop by category</h2>
                        <p className="text-gray-500 italic font-cormorant font-semibold text-2xl">
                            Indulge in what we offer.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
                        {CATEGORIES.map((cat, index) => (
                            <div key={index} className="flex flex-col items-center group cursor-pointer">
                                <div className="w-full aspect-square overflow-hidden mb-4">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <span className="font-serif text-gray-700 text-lg group-hover:text-black">{cat.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
                {/* 3. Promo Section (Minimal Me) */}
                <section className="relative w-full h-[70vh] bg-gray-50">
                    <div className="h-full w-full flex flex-col md:flex-row">
                        {/* Image Side */}
                        <div className="w-full h-full">
                            <img
                                src="asset/Minimal.png"
                                alt="Minimal Collection"
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
                        {/* Content Side (Overlapping on Desktop) */}
                        <div className="w-full md:w-1/3 bg-white/90 md:bg-transparent flex items-center justify-center p-8 md:p-0 md:absolute md:right-0 md:top-80 md:-translate-y-1/2">
                            <div className="p-8 md:p-12  max-w-sm">
                                <h2 className="font-serif text-3xl text-gray-900 mb-3">Minimal Me</h2>
                                <p className="text-gray-500 text-xs mb-6 leading-relaxed">
                                    Introducing our new minimalist collection. Subtle for the active yet elegant.
                                </p>
                                <Button className="bg-transparent px-8 py-3 border border-black text-black uppercase tracking-widest text-xs font-bold hover:bg-black hover:text-white transition duration-300">
                                    Shop Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
                {/* 4. Featured Collections */}
                <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-3">Featured Collections</h2>
                        <p className="text-gray-500 text-sm max-w-xl mx-auto italic font-serif">
                            A curated collection of our most loved designs. From gold to diamonds, each piece blends
                            craftsmanship with contemporary style made to impress.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-x-4 gap-y-10 mb-12">
                        {FEATURED_PRODUCTS.map((product, index) => (
                            <div key={index} className="group cursor-pointer">
                                <div className="w-full aspect-4/5 overflow-hidden mb-4 bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-1">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-red-400 font-medium">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button className="bg-transparent px-7 py-3 border border-[#d4a6a6] text-[#896161] uppercase tracking-widest text-xs font-bold hover:border-black hover:text-white transition duration-300 rounded-xl">
                            Shop Now
                        </Button>
                    </div>
                </section>
                {/* 5. Questions (FAQ) */}
                <section className="py-16 bg-white px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="font-serif text-3xl md:text-4xl text-center text-gray-900 mb-12">Questions</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                            {/* Left Column */}
                            <div className="space-y-2">
                                <Accordion type="single" collapsible className="w-full">
                                    {FAQS.slice(0, 3).map((faq, i) => (
                                        <AccordionItem key={i} value={`item-${i}`} className="border-b border-gray-200">
                                            <AccordionTrigger className="text-sm md:text-base font-medium text-gray-800 hover:text-black hover:no-underline transition-colors py-4">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-gray-500 leading-relaxed pr-4">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-2">
                                <Accordion type="single" collapsible className="w-full">
                                    {FAQS.slice(3, 6).map((faq, i) => (
                                        <AccordionItem
                                            key={i + 3}
                                            value={`item-${i + 3}`}
                                            className="border-b border-gray-200"
                                        >
                                            <AccordionTrigger className="text-sm md:text-base font-medium text-gray-800 hover:text-black hover:no-underline transition-colors py-4">
                                                {faq.question}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-sm text-gray-500 leading-relaxed pr-4">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </section>
                {/* 6. About Section (Dark) */}
                <section className="bg-[#0a0a0a] text-white h-170">
                    <div className="flex flex-col md:flex-row h-auto md:h-170">
                        {/* Image Side */}
                        <div className="w-full md:w-1/2 h-100 md:h-full relative">
                            <img
                                src="asset/AboutIMG.png"
                                alt="Craftsmanship"
                                className="w-170 h-170 object-fit opacity-80"
                            />
                            {/* Diamond Shine Effect (Visual Flourish) */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white blur-3xl rounded-full opacity-20 animate-pulse"></div>
                        </div>

                        {/* Content Side */}
                        <div className="w-full md:w-1/2 p-10 md:p-20 flex flex-col justify-center">
                            <h2 className="font-serif text-3xl md:text-4xl mb-6 text-white/90">What were we made for?</h2>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-light">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                                labore et dolore magna aliqua. Metus vulputate eu scelerisque felis imperdiet proin
                                fermentum. Cras semper auctor neque vitae tempus quam pellentesque. Elementum sagittis vitae
                                et leo duis.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed mb-10 font-light">
                                Elementum sagittis vitae et leo duis. Libero nunc consequat interdum varius. Habitant morbi
                                tristique senectus et netus et malesuada fames ac.
                            </p>
                            <div>
                                <Button
                                    size={40}
                                    className="px-8 py-3 border border-gray-600 text-gray-300 uppercase tracking-widest text-xs font-bold hover:border-white hover:text-white transition duration-300"
                                >
                                    About Us
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default HomePage;

import FeaturedInventory from "@/components/home/FeaturedInventory";
import Hero from "@/components/home/Hero";
import ShopBySport from "@/components/home/ShopBySport";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedInventory />
      <ShopBySport />
      <WhyChooseUs />
    </>
  );
}
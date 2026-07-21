import FeaturedInventory from "@/components/home/FeaturedInventory";
import Hero from "@/components/home/Hero";
import JoinCommunity from "@/components/home/JoinCommunity";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import NewArrivals from "@/components/home/NewArrivals";
import ShopBySport from "@/components/home/ShopBySport";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MarketplaceStats />
      <FeaturedInventory />
      <NewArrivals />
      <ShopBySport />
      <WhyChooseUs />
      <JoinCommunity />
      <Footer />
    </>
  );
}
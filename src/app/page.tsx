import FeaturedInventory from "@/components/home/FeaturedInventory";
import Hero from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedInventory />
    </>
  );
}
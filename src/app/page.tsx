import CollectorsCorner from "@/components/home/CollectorsCorner";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import FeaturedFinds from "@/components/home/FeaturedFinds";
import Hero from "@/components/home/Hero";
import JoinCommunity from "@/components/home/JoinCommunity";
import MarketplaceStats from "@/components/home/MarketplaceStats";
import NewArrivals from "@/components/home/NewArrivals";
import ShopBySport from "@/components/home/ShopBySport";
import TrendingCards from "@/components/cards/TrendingCards";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Reveal from "@/components/ui/Reveal";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <Reveal>
        <FeaturedCollections />
      </Reveal>

      <Reveal>
        <MarketplaceStats />
      </Reveal>

      <Reveal>
        <TrendingCards />
      </Reveal>

      <Reveal>
        <NewArrivals />
      </Reveal>

      <Reveal>
        <FeaturedFinds />
      </Reveal>

      <Reveal>
        <CollectorsCorner />
      </Reveal>

      <Reveal>
        <ShopBySport />
      </Reveal>

      <Reveal>
        <WhyChooseUs />
      </Reveal>

      <Reveal>
        <JoinCommunity />
      </Reveal>
    </main>
  );
}
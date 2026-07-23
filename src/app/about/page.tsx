import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn the story behind Sideline Mentality Cards, our mission, and why collectors trust us.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-zinc-100">
      <section className="bg-slate-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.35em] text-green-400">
            Our Story
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight sm:text-6xl">
            More Than a Card Shop.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-300">
            Sideline Mentality Cards was created by a lifelong sports fan,
            coach, educator, and collector who believes sports have the
            power to develop character long after the final whistle.
          </p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-16">

          <div>
            <h2 className="text-3xl font-black text-slate-950">
              Why We Started
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Like many collectors, this journey started with opening packs,
              trading cards with friends, chasing favorite players, and
              enjoying the excitement that comes with every new addition to
              a collection.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Over time, collecting became more than a hobby—it became a way
              to connect with sports, create memories, and build
              relationships with other collectors across the country.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Sideline Mentality Cards was built to create a trustworthy
              marketplace where collectors can confidently purchase quality
              cards from someone who genuinely loves the hobby.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-black text-slate-950">
                Our Mission
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                Developing athletes.
                <br />
                Building leaders.
                <br />
                Impacting lives beyond the scoreboard.
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                Every order supports a larger vision of encouraging athletes,
                coaches, parents, and collectors through the Sideline
                Mentality brand.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-2xl font-black text-slate-950">
                Our Promise
              </h3>

              <ul className="mt-5 space-y-4 leading-8 text-slate-600">
                <li>✔ Real photos of the cards you purchase</li>
                <li>✔ Secure checkout with Stripe</li>
                <li>✔ Fast shipping</li>
                <li>✔ Collector-quality packaging</li>
                <li>✔ Honest descriptions</li>
                <li>✔ Friendly customer service</li>
              </ul>
            </div>

          </div>

          <div className="rounded-3xl bg-green-700 p-10 text-center text-white">
            <h2 className="text-3xl font-black">
              Thank You
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-green-100">
              Whether you're purchasing your very first sports card or adding
              another grail to your collection, thank you for trusting
              Sideline Mentality Cards.
            </p>

            <p className="mt-6 text-lg font-bold">
              We're honored to be part of your collecting journey.
            </p>

            <Link
              href="/shop"
              className="mt-8 inline-flex rounded-full bg-white px-8 py-4 font-black text-green-700 transition hover:bg-green-100"
            >
              Shop the Collection
            </Link>
          </div>

        </div>
      </section>
    </main>
  );
}
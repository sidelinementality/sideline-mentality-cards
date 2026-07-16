export default function JoinCommunity() {
    return (
      <section className="bg-gradient-to-r from-green-700 to-green-500 px-6 py-24 text-white">
        <div className="mx-auto max-w-4xl text-center">
  
          <p className="text-sm font-bold uppercase tracking-[0.3em]">
            Join the Movement
          </p>
  
          <h2 className="mt-5 text-5xl font-black">
            Never Miss the Next Big Card
          </h2>
  
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-green-100">
            Join thousands of collectors receiving new arrivals, exclusive drops,
            hobby news, giveaways, and market updates from Sideline Mentality Cards.
          </p>
  
          <div className="mx-auto mt-12 flex max-w-xl flex-col gap-4 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-xl px-5 py-4 text-black outline-none"
            />
  
            <button className="rounded-xl bg-black px-8 py-4 font-bold transition hover:bg-gray-900">
              Join Free
            </button>
          </div>
  
          <p className="mt-6 text-sm text-green-100">
            No spam. Ever. Just premium cards, hobby insights, and exclusive offers.
          </p>
  
        </div>
      </section>
    );
  }
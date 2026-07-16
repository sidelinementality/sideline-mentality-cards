export default function Footer() {
    return (
      <footer className="bg-gray-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
  
          <div className="grid gap-12 md:grid-cols-4">
  
            <div>
              <h3 className="text-2xl font-black text-green-400">
                Sideline Mentality
              </h3>
  
              <p className="mt-4 leading-7 text-gray-400">
                Premium sports cards for collectors, investors, athletes,
                and fans who love the hobby.
              </p>
            </div>
  
            <div>
              <h4 className="font-bold uppercase tracking-wider">
                Shop
              </h4>
  
              <ul className="mt-4 space-y-3 text-gray-400">
                <li>Football</li>
                <li>Basketball</li>
                <li>Baseball</li>
                <li>UFC</li>
                <li>WWE</li>
              </ul>
            </div>
  
            <div>
              <h4 className="font-bold uppercase tracking-wider">
                Company
              </h4>
  
              <ul className="mt-4 space-y-3 text-gray-400">
                <li>About</li>
                <li>Sell Your Cards</li>
                <li>Contact</li>
                <li>FAQ</li>
              </ul>
            </div>
  
            <div>
              <h4 className="font-bold uppercase tracking-wider">
                Follow
              </h4>
  
              <ul className="mt-4 space-y-3 text-gray-400">
                <li>Instagram</li>
                <li>Facebook</li>
                <li>YouTube</li>
                <li>Whatnot</li>
              </ul>
            </div>
  
          </div>
  
          <div className="mt-16 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Sideline Mentality Cards.
            All Rights Reserved.
          </div>
  
        </div>
      </footer>
    );
  }
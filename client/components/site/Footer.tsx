import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white/60 py-10 dark:bg-background/60">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 px-3 xs:px-4 md:grid-cols-3 md:px-6 xs:grid-cols-2">
        <div>
          <div className="text-xl font-extrabold">TripGenius</div>
          <p className="mt-2 text-sm text-muted-foreground">
            Plan Smarter. Travel Better. AI-powered itineraries with real-time
            data and collaboration.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold">Product</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link className="hover:text-primary" to="/planner">
                Planner
              </Link>
            </li>
            <li>
              <Link className="hover:text-primary" to="/dashboard">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-sm font-semibold">Company</div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a className="hover:text-primary" href="#features">
                Features
              </a>
            </li>
            <li>
              <a className="hover:text-primary" href="#roadmap">
                Roadmap
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl px-4 text-xs text-muted-foreground md:px-6">
        Built with ❤️ by Puspal Das with his HackStreet Boys Team
      </div>
    </footer>
  );
}

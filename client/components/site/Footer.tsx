import { Link } from "react-router-dom";
import { Plane, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 xs:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div className="xs:col-span-2 md:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Plane className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight gradient-text">
                TripGenius
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Plan Smarter. Travel Better. AI-powered itineraries with real-time
              data and group collaboration.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://github.com/puspadas19/TripGenius"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:hello@tripgenius.dev"
                className="flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  to="/planner"
                >
                  AI Planner
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-primary transition-colors"
                  to="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#features"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="https://github.com/puspadas19/TripGenius"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="hover:text-primary transition-colors"
                  href="#roadmap"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="hover:text-primary transition-colors" href="#">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t pt-8 text-xs text-muted-foreground xs:flex-row">
          <span>
            &copy; {new Date().getFullYear()} TripGenius. All rights reserved.
          </span>
          <span className="flex items-center gap-1">
            Built with <span className="text-red-500">&#10084;</span> by Puspal
            Das &amp; HackStreet Boys
          </span>
        </div>
      </div>
    </footer>
  );
}

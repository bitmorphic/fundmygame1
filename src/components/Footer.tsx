import { Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-border/40 py-12 mt-12">
    <div className="container">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="gradient-text-primary">FundMyGame</span>
        </Link>
        <p className="text-sm text-muted-foreground">
          © 2026 FundMyGame. Empowering athletes, one sponsorship at a time.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

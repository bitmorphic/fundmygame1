import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap, LogOut, User, MessageCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/discover", label: "Discover" },
  { to: "/sponsors", label: "For Sponsors" },
  { to: "/heatmap", label: "Heatmap" },
  { to: "/dashboard", label: "Dashboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary glow-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="gradient-text-primary">FundMyGame</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/messages">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5" /> Messages
                </Button>
              </Link>
              <Link to="/my-profile">
                <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {role === "athlete" ? "My Profile" : role === "sponsor" ? "Company" : "Profile"}
                </Button>
              </Link>
              {role === "admin" && (
                <Link to="/admin">
                  <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                    <Shield className="h-3.5 w-3.5" /> Admin
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-muted-foreground gap-1.5">
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 glow-primary">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.to ? "text-primary bg-primary/10" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/messages" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground">Messages</Link>
                  <Link to="/my-profile" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground">My Profile</Link>
                  {role === "admin" && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="px-3 py-2 text-sm text-muted-foreground">Admin</Link>
                  )}
                  <Button size="sm" variant="outline" onClick={handleSignOut} className="mt-2 border-border text-muted-foreground">Sign Out</Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button size="sm" className="mt-2 w-full bg-primary text-primary-foreground">Get Started</Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

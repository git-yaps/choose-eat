import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-warm p-4">
      <div className="text-center space-y-3 sm:space-y-4">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-primary">404</h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="inline-block text-sm sm:text-base text-primary hover:underline font-medium">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

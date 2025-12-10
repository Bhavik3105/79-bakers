import { cn } from "@/lib/utils";

export const Button = ({ 
  children, 
  variant = "default", 
  className = "", 
  ...props 
}) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-200 inline-flex items-center justify-center";
  
  const variants = {
    default: "bg-pink-600 text-white hover:bg-pink-700 shadow-md hover:shadow-lg",
    ghost: "bg-transparent hover:bg-pink-100 text-pink-700",
    outline: "border-2 border-pink-600 text-pink-600 hover:bg-pink-50"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

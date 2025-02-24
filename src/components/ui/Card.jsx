import { forwardRef } from "react";
import cn from "../../utilis/cn";

// Card variants mapping
const cardVariants = {
  default:
    "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  ghost: "hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent",
  outline: "border border-gray-200 dark:border-gray-700 bg-transparent",
};

// Card sizes mapping
const cardSizes = {
  sm: "p-4",
  default: "p-6",
  lg: "p-8",
};

const Card = forwardRef(
  (
    {
      className = "",
      variant = "default",
      size = "default",
      isLoading = false,
      children,
      ...props
    },
    ref
  ) => {
    if (isLoading) {
      return <CardSkeleton className={className} />;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg shadow-sm transition-all duration-200",
          cardVariants[variant],
          cardSizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className = "", ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center pt-4 mt-4 border-t border-gray-200 dark:border-gray-700",
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Loading skeleton component
const CardSkeleton = ({ className = "" }) => (
  <div
    className={cn(
      "p-6 bg-white rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800",
      className
    )}
  >
    <div className="space-y-4">
      <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
      <div className="w-full h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
      <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse dark:bg-gray-700" />
    </div>
  </div>
);

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};

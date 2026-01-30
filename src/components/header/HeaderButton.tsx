import { Button } from "@/components/shadcn-ui/button";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface HeaderButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "default";
  size?: "icon" | "default";
  children: React.ReactNode;
}

const HeaderButton = forwardRef<HTMLButtonElement, HeaderButtonProps>(
  (
    { className, variant = "ghost", size = "icon", children, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "text-gray-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

HeaderButton.displayName = "HeaderButton";

export { HeaderButton };

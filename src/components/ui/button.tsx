import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-arcade text-[10px] md:text-xs tracking-wider uppercase transition-all duration-150 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative border-2 active:translate-y-[2px] active:translate-x-[2px]",
  {
    variants: {
      variant: {
        default: "bg-arcade-pink text-white border-black",
        yellow: "bg-arcade-yellow text-black border-black",
        outline: "border-2 border-arcade-pink bg-transparent text-arcade-pink",
        ghost: "hover:bg-accent hover:text-accent-foreground border-transparent",
      },
      size: {
        default: "px-6 py-3",
        sm: "px-4 py-2 text-[8px] md:text-[10px]",
        lg: "px-8 py-4 text-xs md:text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// We define a separate utility to match the retro 3D box shadows based on variant
const getShadowForVariant = (variant: string | null | undefined) => {
  switch (variant) {
    case "yellow":
      return { base: "4px 4px 0px 0px rgba(234, 179, 8, 0.4)", hover: "2px 2px 0px 0px rgba(234, 179, 8, 0.4)", active: "0px 0px 0px 0px rgba(234, 179, 8, 0.4)" };
    case "outline":
      return { base: "4px 4px 0px 0px rgba(236, 72, 153, 0.4)", hover: "2px 2px 0px 0px rgba(236, 72, 153, 0.4)", active: "0px 0px 0px 0px rgba(236, 72, 153, 0.4)" };
    case "ghost":
      return { base: "none", hover: "none", active: "none" };
    case "default":
    default:
      // Dark pink/magenta shadow so it appears 3D but matches the retro synthwave theme
      return { base: "4px 4px 0px 0px rgba(157, 23, 77, 1)", hover: "2px 2px 0px 0px rgba(157, 23, 77, 1)", active: "0px 0px 0px 0px rgba(157, 23, 77, 1)" };
  }
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    const [isHovered, setIsHovered] = React.useState(false);
    const [isActive, setIsActive] = React.useState(false);

    const shadowStyles = getShadowForVariant(variant);
    
    // Determine current shadow based on interaction state
    let currentShadow = shadowStyles.base;
    let transform = "translate(0px, 0px)";
    
    if (isActive) {
      currentShadow = shadowStyles.active;
      transform = "translate(4px, 4px)";
    } else if (isHovered) {
      currentShadow = shadowStyles.hover;
      transform = "translate(2px, 2px)";
    }

    // Since we handle transform and shadow via state/style to replicate the framer-motion feel without strictly requiring framer-motion everywhere
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={{
          boxShadow: currentShadow,
          transform: transform,
          ...style
        }}
        ref={ref}
        onMouseEnter={(e) => {
          setIsHovered(true);
          props.onMouseEnter?.(e as any);
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          setIsActive(false);
          props.onMouseLeave?.(e as any);
        }}
        onMouseDown={(e) => {
          setIsActive(true);
          props.onMouseDown?.(e as any);
        }}
        onMouseUp={(e) => {
          setIsActive(false);
          props.onMouseUp?.(e as any);
        }}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

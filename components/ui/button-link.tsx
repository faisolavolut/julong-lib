import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

const btn = cva(
  "px-4 py-2 group relative flex items-stretch justify-center p-0.5 text-center font-medium transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:z-10 focus:outline-none border border-transparent text-white focus:ring-4 focus:ring-cyan-300 enabled:hover:bg-cyan-800 dark:bg-cyan-600 dark:focus:ring-cyan-800 dark:enabled:hover:bg-cyan-700 rounded-lg"
);
const buttonVariants = cva(
  " inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow hover:bg-primary/90 [&_svg]:size-4 ",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 [&_svg]:size-4 ",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground [&_svg]:size-4 ",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 [&_svg]:size-4 ",
        ghost: "hover:bg-accent hover:text-accent-foreground [&_svg]:size-4 ",
        link: "text-primary underline-offset-4 hover:underline [&_svg]:size-4 ",
        noline:
          "text-black border-none border-input bg-background  hover:bg-accent hover:text-accent-foreground p-0 [&_svg]:size-4 ",
        clean: cx(
          "text-black border-none border-input bg-transparent ",
          css`
            padding: 0px;
            height: auto;
            width: auto;
          `
        ),
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const ButtonBetter = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
const ButtonLink: FC<any> = ({
  className,
  children,
  target,
  onClick,
  href,
  variant = "default",
}) => {
  return (
    <Link href={href} target={target} className="flex flex-row items-center">
      <ButtonBetter
        className={cx(className)}
        variant={variant}
        onClick={onClick}
      >
        {children}
      </ButtonBetter>
    </Link>
  );
};
ButtonBetter.displayName = "Button";

export { ButtonLink };

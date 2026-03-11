import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/utils";

const typographyVariants = cva("m-0 font-graphik", {
  variants: {
    variant: {
      p1: "text-[12px] leading-[16px] font-normal",
      p2: "text-[14px] leading-[20px] font-normal",
      p3: "text-[16px] leading-[22px] font-normal",
      p4: "text-[20px] leading-[26px] font-normal",
    },
    textColor: {
      default: "text-default",
      secondary: "text-secondary",
      muted: "text-muted-foreground",
      destructive: "text-destructive",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    variant: "p2",
    textColor: "default",
    weight: "normal",
  },
});

export function Typography({
  variant = "p2",
  textColor = "default",
  weight = "normal",
  as: Tag = "span",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cn(typographyVariants({ variant, textColor, weight }), className)}
      {...props}
    >
      {children}
    </Tag>
  );
}

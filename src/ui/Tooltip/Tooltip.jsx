import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef(
  (
    {
      className,
      sideOffset = 6,
      align = "center",
      side = "top",
      children,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "font-graphik z-[58] max-w-80 rounded-xl bg-spotlight-background px-3 py-2 text-[13px] leading-5 text-primary-foreground shadow-[0_8px_24px_rgba(0,0,0,0.18)] select-none outline-none",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow
          className="fill-spotlight-background"
          width={10}
          height={5}
        />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };

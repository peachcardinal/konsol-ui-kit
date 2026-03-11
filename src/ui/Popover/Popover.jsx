import React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef(
  (
    {
      className,
      align = "center",
      sideOffset = 4,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "bg-popover text-popover-foreground z-[1050] w-72 rounded-md border border-border p-4 shadow-md outline-none",
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
);
PopoverContent.displayName = "PopoverContent";

const PopoverAnchor = React.forwardRef((props, ref) => (
  <PopoverPrimitive.Anchor ref={ref} data-slot="popover-anchor" {...props} />
));
PopoverAnchor.displayName = "PopoverAnchor";

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };

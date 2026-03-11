import { cn } from "../../lib/utils";

function Divider({ className }) {
  return (
    <div className={cn("h-px w-full bg-default-background", className)} />
  );
}

export { Divider };

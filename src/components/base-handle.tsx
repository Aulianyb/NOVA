import { forwardRef } from "react";
import { Handle, HandleProps } from "@xyflow/react";
import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export const BaseHandle = forwardRef<HTMLDivElement, BaseHandleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Handle
        ref={ref}
        {...props}
        className={cn(
          "h-[15px] w-[15px] rounded-full bg-zinc-300 transition dark:bg-zinc-100 dark:border-zinc-800 dark:dark:border-zinc-800 dark:dark:bg-zinc-800",
          className
        )}
        {...props}
      >
        {children}
      </Handle>
    );
  }
);

BaseHandle.displayName = "BaseHandle";

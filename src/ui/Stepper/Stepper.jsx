import React from "react";
import { cn } from "../../lib/utils";
import { Icon } from "../Icon";
import { Typography } from "../Typography";

export function Stepper({ steps, currentStep, className }) {
  return (
    <div className={cn("relative flex w-full", className)}>
      <div
        className="flex w-full items-center"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={currentStep}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.title}>
              <div className="flex items-center flex-shrink-0">
                <div
                  className={cn(
                    "flex items-center justify-center",
                    isCompleted && "text-white",
                    isCurrent && !isCompleted && "text-white"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <div
                    className={cn(
                      "font-cofo flex items-center justify-center rounded-full",
                      isCompleted && "bg-positive",
                      isCurrent && !isCompleted && "bg-primary",
                      !isCompleted && !isCurrent && "bg-muted",
                      "h-6 w-6 md:h-7 md:w-7"
                    )}
                  >
                    {isCompleted ? (
                      <Icon icon="DoneIcon" size={14} />
                    ) : (
                      <span
                        className={cn(
                          "font-cofo text-[12px] leading-[16px]",
                          isCurrent ? "text-white" : "text-muted-foreground"
                        )}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>
                </div>

                {isCurrent && (
                  <div className="font-graphik ml-2.5 hidden md:block max-w-48 whitespace-nowrap">
                    <Typography
                      variant="p1"
                      weight="medium"
                      className="overflow-hidden text-ellipsis"
                    >
                      {step.title}
                    </Typography>
                  </div>
                )}
              </div>

              {!isLast && (
                <div className="flex items-center flex-1 min-w-1.5 md:min-w-8">
                  <div className={cn("mx-2 h-0.25 w-full", "bg-border")} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

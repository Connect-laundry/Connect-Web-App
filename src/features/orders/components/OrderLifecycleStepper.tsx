import { cn } from "@/shared/lib/utils";
import { LIFECYCLE_STEPS } from "../data";

export const OrderLifecycleStepper = ({ currentStepIndex }: { currentStepIndex: number }) => {
    return (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Order Progress
            </p>
            <div className="grid grid-cols-6 gap-2 text-center relative">
                {LIFECYCLE_STEPS.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = currentStepIndex >= idx;
                    const isCurrent = currentStepIndex === idx;

                    return (
                        <div key={step.id} className="flex flex-col items-center gap-1.5 relative z-10 min-w-0">
                            <div
                                className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 border shrink-0",
                                    isCurrent
                                        ? "bg-primary text-primary-foreground border-primary shadow-md scale-110 ring-4 ring-primary/20"
                                        : isDone
                                            ? "bg-primary/20 text-primary border-primary/40"
                                            : "bg-background text-muted-foreground border-border"
                                )}
                            >
                                <StepIcon className="w-4 h-4" />
                            </div>
                            <span
                                className={cn(
                                    "text-[10px] font-bold tracking-tight leading-tight text-center whitespace-normal break-words",
                                    isCurrent
                                        ? "text-primary"
                                        : isDone
                                            ? "text-foreground"
                                            : "text-muted-foreground/60"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
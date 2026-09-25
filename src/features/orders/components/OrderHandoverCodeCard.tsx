import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { KeyRound } from "lucide-react";
import { OrderHandoverCodeCardProps } from "../types";

const CODE_LENGTH = 4;

export const OrderHandoverCodeCard = ({ status, handoverCode, setHandoverCode }: OrderHandoverCodeCardProps) => {
  if (status !== "OUT_FOR_DELIVERY") return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle>
          <KeyRound className="w-4 h-4 text-primary" />
          Delivery Code
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Customer&apos;s delivery code
          </label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={CODE_LENGTH}
            placeholder="Ask the customer for their code"
            value={handoverCode}
            onChange={(e) => setHandoverCode(e.target.value.replace(/\D/g, "").slice(0, CODE_LENGTH))}
            className="h-11 bg-background border-primary/20 focus:border-primary text-lg font-bold tracking-[0.3em] text-center"
          />
          <p className="text-[10px] text-muted-foreground italic">
            Ask the customer to read out their delivery code once you&apos;ve handed over the order.
            Leaving this blank still marks the order delivered, but the payout waits out a short
            protection window instead of releasing immediately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

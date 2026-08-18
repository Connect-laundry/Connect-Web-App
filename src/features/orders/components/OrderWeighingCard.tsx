import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Scale } from "lucide-react";
import { OrderWeighingCardProps } from "../types";



export const OrderWeighingCard = ({ status, weight, setWeight }: OrderWeighingCardProps) => {
  if (status !== "PICKED_UP") return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle>
          <Scale className="w-4 h-4 text-primary" />
          Weighing Event
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            Actual Weight
          </label>
          <Input
            type="number"
            step="0.1"
            placeholder="Enter weight in kilograms..."
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="h-11 bg-background border-primary/20 focus:border-primary text-lg font-bold"
          />
          <p className="text-[10px] text-muted-foreground italic">
            Weight must be confirmed before proceessing begins.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import { Order } from "@/shared/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface OrderDatesProps {
  order: Order;
}

export const OrderDates = ({ order }: OrderDatesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Dates & Times</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">Pickup Date</p>
          <p className="font-medium">
            {new Date(order.pickup_date).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Delivery Date</p>
          <p className="font-medium">
            {new Date(order.delivery_date).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

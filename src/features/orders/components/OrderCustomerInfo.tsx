import { Order } from "@/shared/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface OrderCustomerInfoProps {
  order: Order;
}

export function OrderCustomerInfo({ order }: OrderCustomerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">Name</p>
          <p className="font-medium">{order.customer_name}</p>
        </div>
        {order.customer_phone && (
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="font-medium">{order.customer_phone}</p>
          </div>
        )}
        {order.customer_address && (
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="font-medium">{order.customer_address}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

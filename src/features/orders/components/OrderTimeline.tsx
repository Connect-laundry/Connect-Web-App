import { OrderTimeline as OrderTimelineType } from "@/shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";

interface OrderTimelineProps {
  timeline: OrderTimelineType[] | null;
}

export const OrderTimeline = ({ timeline }: OrderTimelineProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {!timeline || timeline.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            No history available yet.
          </p>
        ) : (
          <div className="space-y-3">
            {timeline.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                {/* Coloured dot */}
                <div className="mt-1 w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                <div>
                  <p className="text-xs font-semibold">{item.status_display}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

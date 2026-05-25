import { Machine, MachineStatus } from "@/shared/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Settings, CheckCircle2, AlertTriangle, Trash2, PowerOff } from "lucide-react";

interface MachineCardProps {
  machine: Machine;
  onStatusChange: (id: string, status: MachineStatus) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

// Function to choose colours based on status
const getStatusTheme = (status: MachineStatus) => {
  switch (status) {
    case "IDLE": return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: CheckCircle2 };
    case "BUSY": return { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: PowerOff };
    case "MAINTENANCE": return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", icon: Settings };
    case "OUT_OF_ORDER": return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: AlertTriangle };
    default: return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", icon: Settings };
  }
};

export function MachineCard({ machine, onStatusChange, onDelete, isLoading }: MachineCardProps) {
  const theme = getStatusTheme(machine.status);
  const StatusIcon = theme.icon;

  return (
    <Card className={`border ${theme.border} ${theme.bg}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{machine.name}</CardTitle>
          <div className={`p-1.5 rounded-full bg-white ${theme.text}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{machine.typeDisplay}</p>
      </CardHeader>
      
      <CardContent>
        <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${theme.text}`}>
           • {machine.statusDisplay}
        </p>

        {machine.notes && (
           <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
             Note: {machine.notes}
           </p>
        )}

        <div className="flex flex-wrap gap-2 pt-2 border-t border-black/5 pb-2">
           {machine.status !== "IDLE" && (
             <Button 
               size="sm" 
               variant="outline" 
               className="bg-white hover:bg-emerald-50 hover:text-emerald-700 text-xs text-black border-black/10"
               disabled={isLoading}
               onClick={() => onStatusChange(machine.id, "IDLE")}
             >
               Set Idle
             </Button>
           )}
           
           {machine.status !== "BUSY" && (
             <Button 
               size="sm" 
               variant="outline" 
               className="bg-white hover:bg-amber-50 hover:text-amber-700 text-xs text-black border-black/10"
               disabled={isLoading}
               onClick={() => onStatusChange(machine.id, "BUSY")}
             >
               Set Busy
             </Button>
           )}

           {machine.status !== "MAINTENANCE" && (
             <Button 
               size="sm" 
               variant="outline" 
               className="bg-white hover:bg-orange-50 hover:text-orange-700 text-xs text-black border-black/10"
               disabled={isLoading}
               onClick={() => onStatusChange(machine.id, "MAINTENANCE")}
             >
               Maintenance
             </Button>
           )}

           {machine.status !== "OUT_OF_ORDER" && (
             <Button 
               size="sm" 
               variant="outline" 
               className="bg-white hover:bg-red-50 hover:text-red-700 text-xs text-black border-black/10"
               disabled={isLoading}
               onClick={() => onStatusChange(machine.id, "OUT_OF_ORDER")}
             >
               Out of Order
             </Button>
           )}
        </div>

        <div className="flex justify-end pt-2">
           <Button
               size="sm"
               variant="ghost"
               className="text-red-600 hover:text-red-700 hover:bg-red-100/50 h-8 px-2"
               onClick={() => onDelete(machine.id)}
               disabled={isLoading}
           >
               <Trash2 className="w-4 h-4 mr-1" /> Remove
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import {
    CheckCircle,
    Clock,
    Package,
    Scale,
    Truck,
    CheckCheck,
} from "lucide-react";

export const ACTION_LABELS: Record<string, string> = {
    accept: "Accept Order",
    reject: "Reject Order",
    markPickedUp: "Mark Picked Up",
    markWashed: "Mark In Process",
    markOutForDelivery: "Mark Out for Delivery",
    markDelivered: "Mark Delivered",
    complete: "Complete Order",
    cancel: "Cancel Order",
};

export const STATUS_BADGE_STYLE: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    CONFIRMED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    PICKED_UP: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    IN_PROCESS: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    OUT_FOR_DELIVERY: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
    DELIVERED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    COMPLETED: "bg-emerald-600/10 text-emerald-700 border-emerald-600/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20",
    CANCELLED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export const LIFECYCLE_STEPS = [
    { id: "PENDING", label: "Received", icon: Clock },
    { id: "CONFIRMED", label: "Confirmed", icon: CheckCircle },
    { id: "PICKED_UP", label: "Picked Up", icon: Package },
    { id: "IN_PROCESS", label: "In Process", icon: Scale },
    { id: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: Truck },
    { id: "COMPLETED", label: "Completed", icon: CheckCheck },
];


export const ORDER_STATUSES = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'PICKED_UP', label: 'Picked Up' },
    { value: 'IN_PROCESS', label: 'In Process' },
    { value: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { value: 'DELIVERED', label: 'Delivered' },
    { value: 'COMPLETED', label: 'Completed' },
]
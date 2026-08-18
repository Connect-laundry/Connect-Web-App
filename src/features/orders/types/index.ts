import { Order, OrderListResponse } from "@/shared/types";

export interface OrderDetailModalProps {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOrderUpdated?: (order: Order) => void;
}

export interface OrderModalFooterProps {
    orderId: string;
    onClose: () => void;
    availableActions: string[];
    isLoading: boolean;
    onAction: (action: string) => void;
}

export interface OrdersFiltersProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    statusFilter: string
    onStatusChange: (status: string) => void
}

export interface OrdersTableProps {
    orders: OrderListResponse | null
    ordersPerPage: number
    currentPage: number
    onPageChange: (page: number) => void
    onSelectOrder: (order: Order) => void
}

export interface OrderWeighingCardProps {
    status: string;
    weight: string;
    setWeight: (weight: string) => void;
}
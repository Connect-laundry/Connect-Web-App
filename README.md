# SIMAME Owner Dashboard

A comprehensive web application for laundry business owners to manage their operations, track orders, and monitor earnings. Built with Next.js 16, TypeScript, Tailwind CSS, and shadcn/ui components.

## Features

### Authentication
- JWT-based login and registration
- Token refresh mechanism for session management
- Role-based access control (OWNER role required)
- Secure logout functionality

### Dashboard
- Real-time order statistics (pending, confirmed, in-progress, delivered)
- Daily, weekly, and monthly earnings overview
- Recent orders list with quick view modal
- Live polling for data updates (10-second intervals)

### Order Management
- Comprehensive order list with pagination, filtering, and search
- Order lifecycle management through interactive modal
- Status transitions: PENDING → CONFIRMED → PICKED_UP → IN_PROCESS → OUT_FOR_DELIVERY → DELIVERED → COMPLETED
- Quick actions for accepting, rejecting, and progressing orders
- Customer information and special instructions display

### Navigation
- Persistent sidebar with quick access to all sections
- Dashboard, Orders, Business, Earnings, Staff, and Settings pages
- Active route highlighting
- Responsive mobile navigation (sidebar toggleable)

### Business Management
- Business profile configuration (placeholder for future expansion)
- Operating hours setup (placeholder)
- Services and pricing management (placeholder)

### Financial Tracking
- Earnings summary by period (today, week, month, total)
- Transaction history with filtering capabilities
- CSV export functionality (placeholder)

### Staff Management
- Staff member list and status tracking (placeholder for future expansion)
- Driver assignment to orders
- Role management (LaundryStaff, Driver)

## Project Structure

```
├── app/
│   ├── (authenticated)/          # Protected app routes
│   │   ├── dashboard/            # Dashboard page
│   │   ├── orders/               # Orders management
│   │   ├── business/             # Business settings
│   │   ├── earnings/             # Financial overview
│   │   ├── staff/                # Staff management
│   │   ├── settings/             # Account settings
│   │   └── layout.tsx            # Authenticated layout with sidebar
│   ├── auth/
│   │   └── login/                # Login page
│   ├── page.tsx                  # Root redirect
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles with design tokens
├── components/
│   ├── auth/                     # Auth components (LoginForm)
│   ├── orders/                   # Order components (OrderDetailModal)
│   ├── layout/                   # Layout components (Sidebar)
│   └── ui/                       # shadcn/ui components
├── lib/
│   ├── api/                      # API client and endpoints
│   │   ├── client.ts             # API client with JWT interceptor
│   │   ├── auth.ts               # Auth endpoints
│   │   ├── dashboard.ts          # Dashboard endpoints
│   │   ├── orders.ts             # Order endpoints
│   │   ├── business.ts           # Business endpoints
│   │   ├── earnings.ts           # Earnings endpoints
│   │   └── staff.ts              # Staff endpoints
│   ├── context/                  # Global state management
│   │   └── AuthContext.tsx       # Auth context provider
│   ├── hooks/                    # Custom hooks
│   │   └── useApi.ts             # API fetching hook
│   ├── types/                    # TypeScript types
│   │   └── index.ts              # All type definitions
│   ├── utils/                    # Utility functions
│   │   └── format.ts             # Formatting utilities
│   └── utils.ts                  # shadcn utilities
└── .env.local                    # Environment variables
```

## Setup Instructions

### Prerequisites
- Node.js 18+ with pnpm package manager
- API access to SIMAME backend

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd simame-owner
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Update `.env.local` with your API configuration:
```
NEXT_PUBLIC_API_BASE_URL=https://connect-full-backend-production.onrender.com/api/v1
NEXT_PUBLIC_APP_NAME=SIMAME Owner
```

### Running the Development Server

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Test Credentials

Use your owner account credentials to log in:
- Email: owner@example.com
- Password: (your password)

## API Integration

The app communicates with the SIMAME backend using SimpleJWT authentication.

### Key Endpoints

**Authentication:**
- `POST /auth/login/` - User login
- `POST /auth/register/` - User registration
- `GET /auth/me/` - Get current user profile
- `POST /auth/refresh/` - Refresh access token

**Dashboard:**
- `GET /laundries/dashboard/stats/` - Order statistics
- `GET /laundries/dashboard/earnings/` - Earnings summary
- `GET /laundries/dashboard/orders/` - Orders list

**Orders:**
- `GET /booking/bookings/` - All orders
- `GET /booking/bookings/{id}/` - Single order
- `POST /booking/lifecycle/{id}/accept/` - Accept order
- `POST /booking/lifecycle/{id}/mark-picked-up/` - Mark as picked up
- `POST /booking/lifecycle/{id}/mark-washed/` - Mark as washed
- `POST /booking/lifecycle/{id}/mark-out-for-delivery/` - Mark out for delivery
- `POST /booking/lifecycle/{id}/mark-delivered/` - Mark as delivered
- `POST /booking/lifecycle/{id}/complete/` - Complete order

**Business:**
- `GET /laundries/laundries/` - Laundry profile
- `PATCH /laundries/laundries/` - Update profile
- `GET /laundries/services/` - Services list
- `PATCH /laundries/services/{id}/` - Update service

**Earnings:**
- `GET /laundries/dashboard/earnings/` - Earnings overview

**Staff:**
- `GET /staff/staff-members/` - Staff list
- `POST /staff/staff-members/` - Create staff member
- `PATCH /staff/staff-members/{id}/` - Update staff member

## Authentication Flow (Secure BFF Pattern)

1. User navigates to `/` and is automatically redirected to `/auth/login` by **Server-Side Middleware** if no session exists.
2. User enters email and password on the login page.
3. Credentials are sent to an internal Next.js route: `POST /api/auth/login`.
4. The internal route communicates with the backend and sets two **HttpOnly, Secure, SameSite=Lax** cookies: `access_token` and `refresh_token`.
5. **No sensitive tokens are stored in the browser (localStorage/sessionStorage)**, eliminating the risk of XSS-based token theft.
6. All subsequent client-side API requests pass through an internal `/api/proxy` which automatically forwards the secure cookies to the backend.
7. If a token expires (401), the internal `refreshToken` logic automatically attempts to rotate the session using the secure HttpOnly refresh cookie.
8. If the session cannot be refreshed, the middleware intercepts the next request and forces a redirect to login.

## Styling

The app uses Tailwind CSS with a professional blue/teal color scheme optimized for business applications:

- **Primary Color:** Deep blue (#0066cc) - for trust and professionalism
- **Secondary Color:** Teal (#00a89e) - for energy and cleanliness
- **Neutrals:** Light grays and whites for clarity
- **Accents:** Green for success, red for errors

Design tokens are defined in `app/globals.css` and can be customized via Tailwind theme variables.

## Performance Optimization

- Server-side authentication check with protected routes
- Client-side route protection with `ProtectedRoute` component
- Polling-based real-time updates (configurable intervals)
- Optimized component rendering with React.memo where needed
- Image optimization for production

## Future Enhancements

- [ ] Real WebSocket support for live order notifications
- [ ] Advanced analytics with charts and graphs
- [ ] Customer management CRM module
- [ ] Mobile app companion
- [ ] Payment integration
- [ ] Multi-location support for business owners
- [ ] Inventory management
- [ ] Customer ratings and reviews
- [ ] Email notifications for order updates
- [ ] SMS alerts for urgent orders

## Troubleshooting

### "Session expired" message
- Clear localStorage and log in again
- Check that API backend is accessible
- Verify environment variables are set correctly

### API connection errors
- Ensure `NEXT_PUBLIC_API_BASE_URL` is correct
- Check that the backend server is running
- Verify network connectivity

### Orders not loading
- Check browser console for specific error messages
- Verify user has OWNER role
- Try refreshing the page

## Support

For issues or questions:
1. Check the API documentation at the backend repository
2. Review environment variable configuration
3. Check browser console for error messages
4. Contact the development team

## License

This project is part of the SIMAME platform.

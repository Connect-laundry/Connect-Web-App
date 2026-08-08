# SIMAME Owner API Setup

## Overview

The SIMAME Owner web app comes with a **built-in mock API** that allows you to develop and test the frontend without needing the external backend server.

## Mock API Endpoints

### Authentication (`/api/auth/*`)

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Request Body**:
  ```json
  {
    "email": "owner@laundry.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access": "jwt_token",
    "refresh": "refresh_token",
    "user": {
      "id": 1,
      "email": "owner@laundry.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "OWNER",
      "business_name": "Clean Fresh Laundry",
      "phone_number": "+2348012345678"
    }
  }
  ```

**Demo Credentials:**
- Email: `owner@laundry.com` | Password: `password123`
- Email: `test@laundry.com` | Password: `test123456`

#### Register
- **Endpoint**: `POST /api/auth/register`
- **Request Body**:
  ```json
  {
    "email": "neowner@laundry.com",
    "password": "securepassword123",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone_number": "+2349012345678"
  }
  ```

#### Get Current User
- **Endpoint**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer {access_token}`

#### Logout
- **Endpoint**: `POST /api/auth/logout`
- **Headers**: `Authorization: Bearer {access_token}`

### Dashboard (`/api/dashboard/*`)

#### Dashboard Overview
- **Endpoint**: `GET /api/dashboard/overview`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**:
  ```json
  {
    "total_orders": 156,
    "completed_orders": 142,
    "pending_orders": 8,
    "in_process_orders": 6,
    "total_earnings": 2500000,
    "earnings_today": 125000,
    "earnings_this_week": 450000,
    "average_completion_time": "2.5 days",
    "customer_satisfaction": 4.8
  }
  ```

#### Orders List
- **Endpoint**: `GET /api/dashboard/orders`
- **Headers**: `Authorization: Bearer {access_token}`
- **Query Parameters**:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `status` (optional: PENDING, CONFIRMED, PICKED_UP, IN_PROCESS, OUT_FOR_DELIVERY, DELIVERED, COMPLETED)
- **Response**:
  ```json
  {
    "count": 5,
    "next": "/api/dashboard/orders?page=2&limit=10",
    "previous": null,
    "results": [
      {
        "id": 1,
        "order_no": "ORD-2024-001",
        "customer_name": "Chioma Okafor",
        "customer_email": "chioma@example.com",
        "customer_phone": "+2348012345678",
        "status": "COMPLETED",
        "status_display": "Completed",
        "pickup_date": "2024-01-15T10:00:00Z",
        "delivery_date": "2024-01-16T14:30:00Z",
        "total_amount": 15000,
        "items": 5
      }
    ]
  }
  ```

#### Earnings
- **Endpoint**: `GET /api/dashboard/earnings`
- **Headers**: `Authorization: Bearer {access_token}`
- **Response**:
  ```json
  {
    "today": 125000,
    "this_week": 450000,
    "this_month": 1850000,
    "total_revenue": 2500000,
    "total_transactions": 142
  }
  ```

## Testing

### Using the Web App UI
1. Navigate to `/auth/login`
2. Use demo credentials:
   - Email: `owner@laundry.com`
   - Password: `password123`
3. Or register a new account

### Using cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "owner@laundry.com",
    "password": "password123"
  }'

# Get current user
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get dashboard overview
curl -X GET http://localhost:3000/api/dashboard/overview \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get orders
curl -X GET http://localhost:3000/api/dashboard/orders?status=COMPLETED \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Switching to External Backend

To use the real SIMAME backend instead of the mock API:

1. Update `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://connect-full-backend.onrender.com/api/v1
   ```

2. Or set the environment variable when running:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=https://connect-full-backend.onrender.com/api/v1 npm run dev
   ```

## Mock Data

The mock API includes sample data for:
- 5 orders with different statuses (PENDING, CONFIRMED, PICKED_UP, IN_PROCESS, OUT_FOR_DELIVERY, COMPLETED)
- Realistic customer information with names, emails, and phone numbers
- Order amounts ranging from ₦12,500 to ₦25,000
- Timestamps spanning across multiple days

## Adding More Mock Data

To add more mock data, edit the respective API route files:
- `/app/api/auth/login/route.ts` - Add users
- `/app/api/dashboard/orders/route.ts` - Add orders
- `/app/api/dashboard/overview/route.ts` - Adjust stats
- `/app/api/dashboard/earnings/route.ts` - Adjust earnings

## Next Steps

Once the external backend is ready:
1. Replace endpoint paths to match the backend API
2. Update request/response types if needed
3. Remove or deprecate the mock API files
4. Update `NEXT_PUBLIC_API_BASE_URL` environment variable

## Troubleshooting

### "Failed to fetch" Error
- Ensure the app is running (`npm run dev`)
- Check browser console for detailed error messages
- Visit `/auth/diagnostics` for connection troubleshooting

### Token Issues
- Tokens are stored in localStorage as `access_token` and `refresh_token`
- Clear browser storage if you encounter auth issues
- Use browser DevTools to inspect stored tokens

### CORS Issues (with external backend)
- Ensure backend has CORS headers configured
- Check backend allows requests from your domain
- See API_SETUP.md for external backend configuration

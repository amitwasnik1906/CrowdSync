# Backend API Documentation

## Authentication Routes

### Admin Auth
- `POST /api/v1/auth/admin/register`  
  Register a new admin
- `POST /api/v1/auth/admin/login`  
  Admin login
- `GET /api/v1/auth/admin/logout`  
  Admin logout (Requires admin authentication)

### User Auth
- `POST /api/v1/auth/user/register`  
  Register a new user
- `POST /api/v1/auth/user/login`  
  User login 
- `GET /api/v1/auth/user/logout`  
  User logout (Requires user authentication)

## Admin Management Routes

### Bus Management
- `POST /api/v1/admin/bus`  
  Add new bus (Admin required)
- `DELETE /api/v1/admin/bus/:id`  
  Delete a bus (Admin required)
- `PUT /api/v1/admin/bus/:id`  
  Update bus details (Admin required)

### Route Management
- `POST /api/v1/admin/route`  
  Add new route (Admin required)
- `DELETE /api/v1/admin/route/:id`  
  Delete a route (Admin required)
- `PUT /api/v1/admin/route/:id`  
  Update route details (Admin required)

## User Routes
- `GET /api/v1/user/buses`  
  Get all available buses
- `GET /api/v1/user/routes`  
  Get all available routes
- `GET /api/v1/user/bus/:id`  
  Get details of a specific bus
- `GET /api/v1/user/route/:id`  
  Get details of a specific route
- `POST /api/v1/user/route/filter`  
  Filter routes based on specified criteria



## Bus Routes
- `PUT /api/v1/bus/update/location`  
  Update real-time bus location
- `PUT /api/v1/bus/update/count`  
  Update passenger count on bus

## Security
- Authentication via JWT refresh tokens in cookies
- Admin middleware validates admin privileges
- User middleware validates user sessions

## Environment Variables
- `DATABASE_URL` - Postgres Url
- `JWT_REFRESH_SECRET`: Secret key for token verification
- `PORT`: Server port (default: 5000)

## Running Locally
- `npm install` - Install all dependencies for the backend
- `npm run start` - Start the backend server

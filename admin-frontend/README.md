# Admin Frontend Documentation

## Overview
This is the frontend application for the admin panel of the bus management system. It provides a user interface for admins to manage buses, routes, and user authentication.

## Features
- Admin authentication (login/logout)
- Manage buses (add, update, delete)
- Manage routes (add, update, delete)
- View analytics (bus usage, route performance)

## Installation
To set up the frontend application, follow these steps:

1. Clone the repository:
   ```bash
   cd admin-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   
   - `VITE_APP_BACKEND_DOMAIN_URL` = 'your_backend_url' # eg. `http://localhost:5000`
   - `VITE_APP_ORSM_API_KEY` = 'your_api_key_here'  # Get this key from openrouteservice.org
   
## Running the Application
To start the frontend application, run:
    ```bash
        npm run dev
    ```

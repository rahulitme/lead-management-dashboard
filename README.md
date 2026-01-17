# Lead Management Dashboard

A full-stack CRM-style dashboard application built with React, Node.js, Express, and MongoDB. Features include lead management with search, filtering, sorting, pagination, and analytics metrics.

## Features

✨ **Core Features:**
- 🔐 User authentication (Login/Register)
- 📊 Lead management dashboard with 500+ dummy leads
- 🔍 Advanced search (by name, email, company)
- 🏷️ Multi-filter support (stage, source, status)
- 📈 Server-side sorting and pagination
- 📋 Lead detail view with edit/delete functionality
- 📊 3+ analytics metrics (total leads, converted leads, conversion rate, total value)
- 📱 Mobile-responsive design using Tailwind CSS

## Tech Stack

**Frontend:**
- React 18+
- Vite (build tool)
- Tailwind CSS (styling)
- React Router (navigation)
- Axios (HTTP client)

**Backend:**
- Node.js & Express
- MongoDB (Atlas free tier)
- JWT authentication
- Bcryptjs (password hashing)

## Project Structure

```
lead-management-dashboard/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── LeadDetail.jsx
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
└── backend/
    ├── models/
    │   ├── Lead.js
    │   └── User.js
    ├── controllers/
    │   ├── leadController.js
    │   └── authController.js
    ├── middleware/
    │   └── auth.js
    ├── routes/
    │   ├── leads.js
    │   └── auth.js
    ├── server.js
    ├── seed.js
    ├── package.json
    └── .env.example
```

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account (free tier)
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from `.env.example`:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with MongoDB credentials:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/lead_management?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_secure_jwt_secret_key
   NODE_ENV=production
   ```

   **To get MongoDB connection string:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free account and cluster
   - Get the connection string with your credentials

5. **Seed the database with 500 dummy leads:**
   ```bash
   npm run seed
   ```

6. **Start the backend server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **For local development, update `.env`:**
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

6. **Build for production:**
   ```bash
   npm run build
   ```

## Demo Credentials

After seeding, use these credentials to login:

- **Username:** `demo`
- **Password:** `demo123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Leads
- `GET /api/leads` - Get leads with filters, search, sorting, pagination
  - Query parameters:
    - `search` - Search by name, email, company
    - `stage` - Filter by stage (New, Contacted, Qualified, etc.)
    - `source` - Filter by source (Website, Email, Social Media, etc.)
    - `status` - Filter by status (Active, Inactive)
    - `sortBy` - Sort field (createdAt, firstName, value)
    - `order` - Sort order (asc, desc)
    - `page` - Page number (default: 1)
    - `limit` - Items per page (default: 20)

- `GET /api/leads/:id` - Get lead details
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead
- `GET /api/leads/analytics` - Get analytics metrics

## Database Seeding

The seed script populates MongoDB with:
- **500 dummy leads** with realistic data
- **1 demo user** for testing

Run seeding with:
```bash
cd backend
npm run seed
```

## Deployment

### Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to [Render.com](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repo
5. Set environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret
   - `NODE_ENV` - Set to `production`
6. Deploy

### Deploy Frontend to Vercel (Free)

1. Push your code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your GitHub repo (select frontend folder)
4. Set environment variable:
   - `VITE_API_URL` - Your deployed backend API URL
5. Deploy

**Example:**
- Backend: `https://lead-backend.onrender.com/api`
- Frontend: `https://lead-frontend.vercel.app`

## Features Breakdown

### Dashboard Analytics
Shows 4 key metrics:
1. **Total Leads** - Count of all leads in system
2. **Converted Leads** - Count of leads with stage "Won"
3. **Conversion Rate** - Percentage of leads converted
4. **Total Value** - Sum of all lead values

### Search & Filters
- Search across name, email, company
- Filter by lead stage (7 options)
- Filter by lead source (6 options)
- Filter by status (Active/Inactive)
- Sort by creation date, name, or value
- Configurable pagination (10-100 items per page)

### Lead Detail View
- View complete lead information
- Edit lead fields
- Delete lead
- Update stage, source, and other properties

## Environment Variables

### Backend (.env)
```
MONGODB_URI=<your_mongodb_connection_string>
PORT=5000
JWT_SECRET=<your_secure_secret_key>
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=<your_backend_api_url>
```

## Common Issues & Solutions

### MongoDB Connection Error
- Ensure IP whitelist includes your IP on MongoDB Atlas
- Check username and password are URL-encoded if they contain special characters
- Verify connection string format is correct

### CORS Issues
- Backend includes CORS middleware
- For production, update CORS origin to your frontend URL

### Frontend can't reach backend
- Check backend is running on correct port
- Verify API URL in frontend .env matches backend URL
- Check network tab in browser dev tools

## Performance Optimizations

- Indexes on frequently searched fields (email, firstName, lastName, company)
- Server-side pagination to limit data transfer
- Efficient MongoDB queries with proper filtering
- Lazy loading in frontend components

## Scalability Improvements (Future)

- Add caching layer (Redis)
- Implement websocket for real-time updates
- Add role-based access control
- Implement audit logging
- Add data export functionality
- Implement lead scoring algorithm

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

## Support

For issues and questions, please create a GitHub issue.

---

**Built for hiring assignment** | **Deadline: January 17, 2026**

# Sahithyotsav Results System

A full-stack web application for managing and displaying literary competition results, built with HTML/CSS/JavaScript frontend and Node.js/Express/PostgreSQL backend.

## 🚀 Migration from Firebase to Neon PostgreSQL

This project has been migrated from Firebase Firestore to Neon PostgreSQL for improved performance, cost efficiency, and data control.

### What Changed

**Backend Migration:**
- ✅ Firebase Firestore → Neon PostgreSQL database
- ✅ Firebase Authentication → JWT-based authentication
- ✅ Firebase Hosting → Self-hosted Node.js API
- ✅ Client-side Firebase SDK → REST API calls

**Database Schema:**
- `users` - Admin authentication
- `results` - Competition results with rankings
- `leaderboard` - Team points and standings
- `meta` - System metadata (results declared count)
- `gallery` - Event photos and images

## 📁 Project Structure

```
sahityotsav/
├── backend/                    # Node.js API server
│   ├── routes/                 # API route handlers
│   │   ├── auth.js            # Authentication endpoints
│   │   ├── results.js         # Results CRUD operations
│   │   ├── leaderboard.js     # Leaderboard management
│   │   └── gallery.js         # Gallery image management
│   ├── database-schema.sql    # PostgreSQL schema
│   ├── server.js              # Main server file
│   ├── package.json           # Dependencies
│   └── README.md              # Backend documentation
├── *.html                     # Frontend pages
├── style.css                  # Global styles
├── script.js                  # UI functionality
└── images/                    # Static assets
```

## 🛠 Setup Instructions

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Database Setup

1. **Create Neon PostgreSQL Database:**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your database URL and settings
   ```

3. **Initialize Database:**
   ```bash
   npm run init-db
   ```

4. **Start Backend Server:**
   ```bash
   npm start
   # or for development:
   npm run dev
   ```

### 3. Frontend Configuration

Update the API base URL in all frontend files:
```javascript
const API_BASE = 'http://localhost:3000/api'; // Change to your deployed URL
```

Files to update:
- `results.html`
- `leaderboard.html`
- `add-results.html`
- `update-leaderboard.html`
- `login.html`
- `admin.html`
- `gallery.html`

## 🔐 Authentication

**Default Admin Account:**
- Email: `admin@sahityotsav.com`
- Password: `admin123`

**Change the password immediately after first login!**

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change admin password

### Results
- `GET /api/results/categories` - Get all categories
- `GET /api/results/competitions/:category` - Get competitions for category
- `GET /api/results/:category/:competition` - Get results for specific competition
- `POST /api/results` - Add new results (admin only)

### Leaderboard
- `GET /api/leaderboard` - Get team leaderboard
- `PUT /api/leaderboard` - Update leaderboard (admin only)

### Gallery
- `GET /api/gallery` - Get gallery images
- `GET /api/gallery/categories` - Get gallery categories
- `POST /api/gallery` - Upload image (admin only)
- `DELETE /api/gallery/:id` - Delete image (admin only)

## 🎯 Key Features

- **Real-time Results Display** - View competition results by category and event
- **Team Leaderboard** - Track team performance across all competitions
- **Admin Panel** - Secure admin interface for managing results
- **Gallery System** - Upload and display event photos
- **Responsive Design** - Mobile-friendly interface
- **Dark Mode Support** - Theme switching capability

## 🔄 Migration Benefits

**From Firebase:**
- ❌ Fixed monthly costs
- ❌ Vendor lock-in
- ❌ Limited query flexibility
- ❌ Complex authentication setup

**To Neon PostgreSQL:**
- ✅ Pay only for what you use
- ✅ Full SQL query capabilities
- ✅ Custom authentication logic
- ✅ Data export/import flexibility
- ✅ Better performance for complex queries
- ✅ Self-hosted control

## 🚀 Deployment

### Backend Deployment
Deploy the Node.js backend to services like:
- Vercel
- Railway
- Render
- Heroku
- DigitalOcean App Platform

### Frontend Deployment
The HTML/CSS/JS frontend can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 📝 Data Migration

If you have existing Firebase data, you can export it and import to PostgreSQL:

1. Export data from Firebase console
2. Transform to match PostgreSQL schema
3. Use the API endpoints to import data
4. Or directly insert into PostgreSQL tables

## 🐛 Troubleshooting

**Common Issues:**

1. **Database Connection Error:**
   - Check DATABASE_URL in .env
   - Ensure Neon database is active
   - Verify SSL settings

2. **Authentication Issues:**
   - Check JWT_SECRET is set
   - Verify token expiration
   - Clear localStorage if needed

3. **CORS Errors:**
   - Update FRONTEND_URL in backend .env
   - Check API_BASE URL in frontend files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Need Help?** Check the backend README for detailed API documentation.
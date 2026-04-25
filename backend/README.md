# Sahithyotsav Backend API

Backend API for the Sahithyotsav results system using Node.js, Express, and Neon PostgreSQL.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   - Copy `.env.example` to `.env`
   - Fill in your Neon PostgreSQL connection string
   - Set a secure JWT secret
   - Configure other settings as needed

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change admin password

### Results
- `GET /api/results/categories` - Get all categories
- `GET /api/results/competitions/:category` - Get competitions for a category
- `GET /api/results/:category/:competition` - Get results for category/competition
- `POST /api/results` - Add new results (admin only)

### Leaderboard
- `GET /api/leaderboard` - Get team leaderboard
- `PUT /api/leaderboard` - Update leaderboard (admin only)
- `GET /api/leaderboard/team/:teamName` - Get specific team points

### Gallery
- `GET /api/gallery` - Get gallery images
- `GET /api/gallery/categories` - Get gallery categories
- `POST /api/gallery` - Upload image (admin only)
- `DELETE /api/gallery/:id` - Delete image (admin only)

## Database Schema

The database includes the following tables:
- `users` - User accounts for authentication
- `results` - Competition results
- `leaderboard` - Team points
- `meta` - Metadata like results declared count
- `gallery` - Gallery images

## Default Admin Account

- Email: admin@sahityotsav.com
- Password: admin123

**Change the password after first login!**

## File Uploads

Images are stored in the `uploads/` directory. Configure the upload path in environment variables if needed.

## Security

- JWT authentication for protected routes
- Rate limiting on API endpoints
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
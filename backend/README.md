# Sahithyotsav Backend API

This backend is a simplified static server and mock API for the Sahithyotsav website. It serves frontend files from the project root and provides lightweight endpoints for results, leaderboard, gallery, and authentication.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Open the site:**
   - Default port: `http://localhost:3000`
   - If port `3000` is busy, use a different port:
     ```powershell
     $env:PORT=3100; npm start
     ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with admin email/password
- `GET /api/auth/verify` - Verify JWT token

### Results
- `GET /api/results/categories` - Get all categories
- `GET /api/results/competitions/:category` - Get competitions for a category
- `GET /api/results/:category/:competition` - Get results for a competition
- `GET /api/results/all` - Get all results (admin only)
- `POST /api/results` - Save competition results (admin only)
- `DELETE /api/results/:category/:competition` - Delete competition results (admin only)

### Leaderboard
- `GET /api/leaderboard` - Get the leaderboard and declared result count
- `PUT /api/leaderboard` - Update leaderboard data (admin only)

### Gallery
- `GET /api/gallery` - Get gallery images

## Admin Credentials

- Email: `admin@sahityotsav.com`
- Password: `admin123`

> These credentials are for the local demo backend only.

## Notes

- No database is required for this simplified backend.
- Data is stored in memory and resets when the server restarts.
- Frontend files are served from the parent directory of `backend/`.

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
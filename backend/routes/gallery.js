const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { sql } = require('../server');

const router = express.Router();

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for Cloudinary uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'sahityotsav-gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const upload = multer({ storage: storage });

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const { category, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT id, title, description, image_url, category, created_at
      FROM gallery
    `;
    const params = [];
    let paramIndex = 1;

    if (category) {
      query += ` WHERE category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit), parseInt(offset));

    const result = await sql`
      SELECT id, title, description, image_url, category, created_at
      FROM gallery
      ${category ? sql`WHERE category = ${category}` : sql``}
      ORDER BY created_at DESC
      LIMIT ${parseInt(limit)}
      OFFSET ${parseInt(offset)}
    `;

    res.json(result);

  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get gallery categories
router.get('/categories', async (req, res) => {
  try {
    const result = await sql`SELECT DISTINCT category FROM gallery WHERE category IS NOT NULL ORDER BY category`;

    const categories = result.map(row => row.category);
    res.json(categories);

  } catch (error) {
    console.error('Error fetching gallery categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload image (admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, description, category } = req.body;
    // CloudinaryStorage provides the full Cloudinary URL in req.file.path
    const imageUrl = req.file.path;

    const result = await sql`
      INSERT INTO gallery (title, description, image_url, category, uploaded_by)
      VALUES (${title || null}, ${description || null}, ${imageUrl}, ${category || null}, ${req.user.userId})
      RETURNING id, title, description, image_url, category, created_at
    `;

    res.status(201).json(result[0]);

  } catch (error) {
    console.error('Error uploading image:', error);

    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete image (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // Get image info first
    const selectResult = await sql`SELECT image_url FROM gallery WHERE id = ${id}`;

    if (selectResult.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }

    const imageUrl = selectResult[0].image_url;

    // Delete from database
    await sql`DELETE FROM gallery WHERE id = ${id}`;

    // Delete from Cloudinary
    try {
      // Extract public_id from Cloudinary URL
      const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Don't fail the request if Cloudinary deletion fails
    }

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
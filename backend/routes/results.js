const express = require('express');
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

// Get competitions for a category
router.get('/competitions/:category', async (req, res) => {
  try {
    const { category } = req.params;

    const query = sql`
      SELECT DISTINCT competition
      FROM results
      WHERE category = ${category}
      ORDER BY competition
    `;

    const result = await query;

    const competitions = result.map(row => row.competition);

    // If no results in database, return fallback competitions
    if (competitions.length === 0) {
      const fallbackCompetitions = {
        LP: ['Madh Song', 'Elocution', 'Quiz', 'Story Telling', 'Pencil Drawing', 'Water Colouring', 'Language Game', 'Reading Malayalam', 'Reading Arabi-Malayalam', 'Book Test'],
        UP: ['Mappila Song', 'Elocution', 'Quiz', 'Story Telling', 'Pencil Drawing', 'Water Colouring', 'Ganitha Keli', 'Spelling Bee', 'Sudoku', 'Book Test', 'Story Writing'],
        HS: ['Madh Song', 'Mappila Song', 'Elocution Malayalam', 'Elocution English', 'Quiz', 'Poem Recitation Malayalam', 'Poem Recitation Urdu', 'Pencil Drawing', 'Water Colouring', 'Language Game English', 'News Reading', 'Caption Writing', 'Book Test', 'Essay Writing Malayalam', 'Poem Making', 'Story Writing'],
        HSS: ['Mappila Song', 'Urdu Poem Recitation', 'Bhakthi Song', 'Elocution', 'Digital Painting', 'Story Writing', 'Poem Making', 'Essay Writing English', 'Essay Writing Malayalam', 'Quiz', 'Pencil Drawing', 'Water Colouring', 'News Writing', 'Calligraphy Arabic', 'Reel Making', 'Book Test'],
        Junior: ['Sahitya Samvadam', 'Mappila Song', 'Elocution Malayalam', 'Elocution English', 'Elocution Arabic', 'Story Writing', 'Poem Making', 'Book Test', 'Essay Writing Malayalam', 'Essay Writing Arabic', 'Mudravakya Rachana', 'Madh Gana Rachana', 'Quiz', 'Translation Arabic', 'Calligraphy Arabic', 'Social Text', 'Hadees Musabaqa', 'AI Poem Making', 'Reel Making'],
        Senior: ['Political Debate', 'Mappila Song', 'Hamd Urdu', 'Poem Recitation English', 'Elocution Malayalam', 'Elocution English', 'Elocution Urdu', "Musha'ara Alfiya", 'Poem Making', 'Poem Making English', 'Story Writing', 'Book Test', 'Essay Writing Malayalam', 'Essay Writing English', 'Essay Writing Urdu', 'Translation English', 'Madh Gana Rachana', 'Mudravakya Rachana', 'Quiz', 'Feature Writing', 'Social Text', 'Poster Designing', 'E-poster', 'Digital Illustration', 'Dgital Painting'],
        General: ['Spot Magazine', 'Duff', 'Arabana', 'Group Song Cat-A', 'Group Song Cat-B', 'Moulid Recitation', 'Qaseeda Recitation', 'Viplavagaanam', 'Chumarezhuth', 'Malappattu', 'Risala Quiz', 'Qawwali', 'Viplava Gana Rachana', 'Mappilappattu Rachana', 'Project', 'Collage', 'Nasheeda', 'Family Magazine']
      };

      return res.json(fallbackCompetitions[category] || []);
    }

    res.json(competitions);

  } catch (error) {
    console.error('Error fetching competitions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all results (admin only)
router.get('/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const query = sql`
      SELECT id, category, competition, position, name, team, points, status
      FROM results
      ORDER BY created_at DESC
    `;

    const result = await query;
    res.json({ results: result });

  } catch (error) {
    console.error('Error fetching all results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get results for a specific category and competition
router.get('/:category/:competition', async (req, res) => {
  try {
    const { category, competition } = req.params;

    const query = sql`
      SELECT name, category, competition, position as rank, points, status, team
      FROM results
      WHERE category = ${category} AND competition = ${competition}
      ORDER BY points DESC, created_at ASC
    `;

    const result = await query;

    res.json({ results: result });

  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new results (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const results = req.body.results;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Results array is required' });
    }

    // Insert all results
    for (const result of results) {
      const { category, competition, position, name, team, points, status = 'Completed' } = result;

      if (!category || !competition || !name) {
        return res.status(400).json({ error: 'Category, competition, and name are required for each result' });
      }

      await sql`
        INSERT INTO results (category, competition, position, name, team, points, status)
        VALUES (${category}, ${competition}, ${position}, ${name}, ${team}, ${points || 0}, ${status})
      `;
    }

    res.status(201).json({ message: 'Results added successfully' });

  } catch (error) {
    console.error('Error adding results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a specific result by ID (admin only)
router.delete('/result/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await sql`
      DELETE FROM results
      WHERE id = ${id}
    `;

    res.json({ message: 'Result deleted successfully' });

  } catch (error) {
    console.error('Error deleting result:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete results for a specific category and competition (admin only)
router.delete('/:category/:competition', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { category, competition } = req.params;

    const deleteQuery = sql`
      DELETE FROM results
      WHERE category = ${category} AND competition = ${competition}
    `;

    const result = await deleteQuery;

    if (result.length === 0) {
      return res.status(404).json({ error: 'No results found to delete' });
    }

    res.json({ message: 'Results deleted successfully', deletedCount: result.length });

  } catch (error) {
    console.error('Error deleting results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const query = sql`SELECT DISTINCT category FROM results ORDER BY category`;
    const result = await query;

    const categories = result.map(row => row.category);

    // Always include default categories
    const defaultCategories = ['LP', 'UP', 'HS', 'HSS', 'Junior', 'Senior', 'General'];
    const allCategories = [...new Set([...defaultCategories, ...categories])];

    res.json(allCategories);

  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
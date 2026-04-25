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

// Get leaderboard
router.get('/', async (req, res) => {
  try {
    const query = sql`
      SELECT team_name, points
      FROM leaderboard
      ORDER BY points DESC, team_name ASC
    `;

    const result = await query;

    // Get results declared count
    const metaQuery = sql`SELECT value FROM meta WHERE key = ${'summary'}`;
    const metaResult = await metaQuery;
    const resultsDeclared = metaResult.length > 0
      ? metaResult[0].value.resultsDeclared || 0
      : 0;

    const leaderboard = result.map((row, index) => ({
      rank: index + 1,
      team: row.team_name,
      points: row.points
    }));

    res.json({
      leaderboard,
      resultsDeclared
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update leaderboard (admin only)
router.put('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { teams, resultsDeclared } = req.body;

    if (!Array.isArray(teams)) {
      return res.status(400).json({ error: 'Teams array is required' });
    }

    // Update results declared count
    if (typeof resultsDeclared === 'number') {
      await sql`
        INSERT INTO meta (key, value)
        VALUES (${'summary'}, ${JSON.stringify({ resultsDeclared })})
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    // Update team points
    for (const team of teams) {
      const { name, points } = team;

      if (!name || typeof points !== 'number') {
        return res.status(400).json({ error: 'Team name and points are required' });
      }

      await sql`
        INSERT INTO leaderboard (team_name, points, updated_at)
        VALUES (${name}, ${points}, CURRENT_TIMESTAMP)
        ON CONFLICT (team_name) DO UPDATE SET
          points = EXCLUDED.points,
          updated_at = CURRENT_TIMESTAMP
      `;
    }

    res.json({ message: 'Leaderboard updated successfully' });

  } catch (error) {
    console.error('Error updating leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get team points
router.get('/team/:teamName', async (req, res) => {
  try {
    const { teamName } = req.params;

    const query = sql`SELECT points FROM leaderboard WHERE team_name = ${teamName}`;
    const result = await query;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json({ team: teamName, points: result[0].points });

  } catch (error) {
    console.error('Error fetching team points:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
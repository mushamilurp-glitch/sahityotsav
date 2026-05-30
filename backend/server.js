const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'sahityotsav-simple-secret';
const ADMIN_EMAIL = 'admin@sahityotsav.com';
const ADMIN_PASSWORD = 'admin123';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

const categories = ['LP', 'UP', 'HS', 'HSS', 'Junior', 'Senior', 'General'];
const competitionList = {
  LP: ['Madh Song', 'Elocution', 'Quiz', 'Story Telling', 'Pencil Drawing', 'Water Colouring', 'Language Game', 'Reading Malayalam', 'Reading Arabi-Malayalam', 'Book Test'],
  UP: ['Mappila Song', 'Elocution', 'Quiz', 'Story Telling', 'Pencil Drawing', 'Water Colouring', 'Ganitha Keli', 'Spelling Bee', 'Sudoku', 'Book Test', 'Story Writing'],
  HS: ['Madh Song', 'Mappila Song', 'Elocution Malayalam', 'Elocution English', 'Quiz', 'Poem Recitation Malayalam', 'Poem Recitation Urdu', 'Pencil Drawing', 'Water Colouring', 'Language Game English', 'News Reading', 'Caption Writing', 'Book Test', 'Essay Writing Malayalam', 'Poem Making', 'Story Writing'],
  HSS: ['Mappila Song', 'Urdu Poem Recitation', 'Bhakthi Song', 'Elocution', 'Digital Painting', 'Story Writing', 'Poem Making', 'Essay Writing English', 'Essay Writing Malayalam', 'Quiz', 'Pencil Drawing', 'Water Colouring', 'News Writing', 'Calligraphy Arabic', 'Reel Making', 'Book Test'],
  Junior: ['Sahitya Samvadam', 'Mappila Song', 'Elocution Malayalam', 'Elocution English', 'Elocution Arabic', 'Story Writing', 'Poem Making', 'Book Test', 'Essay Writing Malayalam', 'Essay Writing Arabic', 'Mudravakya Rachana', 'Madh Gana Rachana', 'Quiz', 'Translation Arabic', 'Calligraphy Arabic', 'Social Text', 'Hadees Musabaqa', 'AI Poem Making', 'Reel Making'],
  Senior: ['Political Debate', 'Mappila Song', 'Hamd Urdu', 'Poem Recitation English', 'Elocution Malayalam', 'Elocution English', 'Elocution Urdu', "Musha'ara Alfiya", 'Poem Making', 'Poem Making English', 'Story Writing', 'Book Test', 'Essay Writing Malayalam', 'Essay Writing English', 'Essay Writing Urdu', 'Translation English', 'Madh Gana Rachana', 'Mudravakya Rachana', 'Quiz', 'Feature Writing', 'Social Text', 'Poster Designing', 'E-poster', 'Digital Illustration', 'Dgital Painting'],
  General: ['Spot Magazine', 'Duff', 'Arabana', 'Group Song Cat-A', 'Group Song Cat-B', 'Moulid Recitation', 'Qaseeda Recitation', 'Viplavagaanam', 'Chumarezhuth', 'Malappattu', 'Risala Quiz', 'Qawwali', 'Viplava Gana Rachana', 'Mappilappattu Rachana', 'Project', 'Collage', 'Nasheeda', 'Family Magazine']
};

const resultsStore = {
  'LP|Madh Song': [
    { category: 'LP', competition: 'Madh Song', position: '1st', rank: '1st', name: 'Arya', team: 'Koottilangadi', points: 3, status: 'Completed' },
    { category: 'LP', competition: 'Madh Song', position: '2nd', rank: '2nd', name: 'Neha', team: 'Perinthattiri', points: 2, status: 'Completed' },
    { category: 'LP', competition: 'Madh Song', position: '3rd', rank: '3rd', name: 'Aadhya', team: 'Padinhattumutri Town', points: 1, status: 'Completed' }
  ],
  'UP|Elocution': [
    { category: 'UP', competition: 'Elocution', position: '1st', rank: '1st', name: 'Riya', team: 'Kolapparamba', points: 3, status: 'Completed' },
    { category: 'UP', competition: 'Elocution', position: '2nd', rank: '2nd', name: 'Zain', team: 'Kadoopuram', points: 2, status: 'Completed' },
    { category: 'UP', competition: 'Elocution', position: '3rd', rank: '3rd', name: 'Mira', team: 'Unnamthala', points: 1, status: 'Completed' }
  ]
};

let leaderboardData = [
  { rank: 1, team: 'Koottilangadi', points: 28 },
  { rank: 2, team: 'Perinthattiri', points: 24 },
  { rank: 3, team: 'Kolapparamba', points: 22 },
  { rank: 4, team: 'Padinhattumutri Town', points: 19 },
  { rank: 5, team: 'Kadoopuram', points: 16 }
];

let resultsDeclared = 18;

const galleryData = [
  { id: 1, title: 'Festival Poster', description: 'Sahityotsav launch poster', image_url: '/images/main-poster.jpg', category: 'Festival', created_at: new Date('2024-05-20T10:00:00Z').toISOString() },
  { id: 2, title: 'Cultural Art', description: 'A vibrant cultural moment', image_url: '/images/payasam.jpg', category: 'Events', created_at: new Date('2024-05-22T12:00:00Z').toISOString() },
  { id: 3, title: 'Program Announcement', description: 'Announcement design for Sahityotsav', image_url: '/images/prakhyapanam.jpg', category: 'Announcements', created_at: new Date('2024-05-23T09:30:00Z').toISOString() }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({ user: { email: req.user.email, role: req.user.role } });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/results/categories', (req, res) => {
  res.json(categories);
});

app.get('/api/results/competitions/:category', (req, res) => {
  const category = req.params.category;
  res.json(competitionList[category] || []);
});

app.get('/api/results/:category/:competition', (req, res) => {
  const category = req.params.category;
  const competition = req.params.competition;
  const results = resultsStore[`${category}|${competition}`] || [];
  res.json({ results });
});

app.get('/api/results/all', authenticateToken, requireAdmin, (req, res) => {
  const allResults = Object.values(resultsStore).flat();
  res.json({ results: allResults });
});

app.post('/api/results', authenticateToken, requireAdmin, (req, res) => {
  const { results } = req.body;
  if (!Array.isArray(results) || results.length === 0) {
    return res.status(400).json({ error: 'Results array is required' });
  }

  const category = results[0].category;
  const competition = results[0].competition;
  if (!category || !competition) {
    return res.status(400).json({ error: 'Each result must have category and competition' });
  }

  resultsStore[`${category}|${competition}`] = results.map((item) => ({
    category: item.category,
    competition: item.competition,
    position: item.position,
    rank: item.position,
    name: item.name,
    team: item.team,
    points: item.points || 0,
    status: item.status || 'Completed'
  }));

  res.status(201).json({ message: 'Results saved successfully' });
});

app.delete('/api/results/:category/:competition', authenticateToken, requireAdmin, (req, res) => {
  const category = req.params.category;
  const competition = req.params.competition;
  const key = `${category}|${competition}`;
  if (!resultsStore[key]) {
    return res.status(404).json({ error: 'No results found for this competition' });
  }

  delete resultsStore[key];
  res.json({ message: 'Competition results deleted successfully' });
});

app.get('/api/leaderboard', (req, res) => {
  res.json({ leaderboard: leaderboardData, resultsDeclared });
});

app.put('/api/leaderboard', authenticateToken, requireAdmin, (req, res) => {
  const { teams, resultsDeclared: declared } = req.body;
  if (!Array.isArray(teams)) {
    return res.status(400).json({ error: 'Teams array is required' });
  }

  leaderboardData = teams.map((team, index) => ({
    rank: index + 1,
    team: team.name || `Team ${index + 1}`,
    points: Number(team.points) || 0
  }));

  if (typeof declared === 'number') {
    resultsDeclared = declared;
  }

  res.json({ message: 'Leaderboard updated successfully' });
});

app.get('/api/gallery', (req, res) => {
  res.json(galleryData);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
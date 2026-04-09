import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, initDB } from './db.js';

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_recipin_key_123!';

app.use(cors());
app.use(express.json());

initDB();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await pool.query(
        'INSERT INTO users (username, passwordHash) VALUES ($1, $2) RETURNING id',
        [username, passwordHash]
    ).catch(dbErr => {
        if (dbErr.code === '23505') return res.status(400).json({ error: 'Username already exists' });
        return res.status(500).json({ error: 'Database error' });
    });

    if (!result || res.headersSent) return;
    const newUserId = result.rows[0].id;
    const token = jwt.sign({ id: newUserId, username }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: newUserId, username } });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: 'Invalid username or password' });

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username } });
});

app.get('/api/recipes', async (req, res) => {
    const authHeader = req.headers['authorization'];
    let userId = 0;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        if (decoded) userId = decoded.id;
    }

    const query = `
      SELECT 
        r.*, 
        EXISTS(SELECT 1 FROM saves s WHERE s.recipe_id = r.id AND s.user_id = $1) as isSaved,
        EXISTS(SELECT 1 FROM upvotes u WHERE u.recipe_id = r.id AND u.user_id = $1) as hasUpvoted
      FROM recipes r
      ORDER BY r.createdAt DESC
    `;
    const result = await pool.query(query, [userId]);

    const formattedRecipes = result.rows.map(r => ({
        ...r,
        prepTime: r.preptime,
        ingredients: JSON.parse(r.ingredients || '[]'),
        steps: JSON.parse(r.steps || '[]'),
        isSaved: !!r.issaved,
        hasUpvoted: !!r.hasupvoted
    }));

    res.json(formattedRecipes);
});

app.post('/api/recipes', authenticateToken, async (req, res) => {
    const { title, image, prepTime, difficulty, ingredients, steps } = req.body;
    const author_id = req.user.id;
    const author_name = req.user.username;

    const result = await pool.query(
        `INSERT INTO recipes (title, author_id, author_name, image, prepTime, difficulty, ingredients, steps) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [title, author_id, author_name, image, prepTime, difficulty, JSON.stringify(ingredients), JSON.stringify(steps)]
    );

    res.status(201).json({ message: 'Recipe created successfully', id: result.rows[0].id });
});

app.post('/api/recipes/:id/save', authenticateToken, async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const look = await pool.query('SELECT * FROM saves WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);

    if (look.rows.length > 0) {
        await pool.query('DELETE FROM saves WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
        res.json({ message: 'Recipe removed from saves', isSaved: false });
    } else {
        await pool.query('INSERT INTO saves (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
        res.json({ message: 'Recipe saved', isSaved: true });
    }
});

app.post('/api/recipes/:id/upvote', authenticateToken, async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user.id;

    const look = await pool.query('SELECT * FROM upvotes WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);

    if (look.rows.length > 0) {
        await pool.query('DELETE FROM upvotes WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
        await pool.query('UPDATE recipes SET upvotes = upvotes - 1 WHERE id = $1', [recipeId]);
        res.json({ message: 'Upvote removed', hasUpvoted: false });
    } else {
        await pool.query('INSERT INTO upvotes (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
        await pool.query('UPDATE recipes SET upvotes = upvotes + 1 WHERE id = $1', [recipeId]);
        res.json({ message: 'Upvoted', hasUpvoted: true });
    }
});

export default app;

import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './model/user.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- MIDDLEWARE ----------------
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// ---------------- DB ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

/* =========================================================
   🔐 GITHUB OAUTH (MANUAL - NO PASSPORT)
========================================================= */

// STEP 1: Redirect to GitHub login
app.get('/auth/github', (req, res) => {
  const url =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${process.env.GITHUB_CLIENT_ID}` +
    `&scope=user:email`;

  res.redirect(url);
});

// STEP 2: Callback from GitHub
app.get('/auth/github/callback', async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${process.env.CLIENT_URL}/auth?error=missing_code`);
  }

  try {
    // 1. Get access token
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const accessToken = tokenRes.data.access_token;

    if (!accessToken) {
      return res.redirect(`${process.env.CLIENT_URL}/auth?error=token_failed`);
    }

    // 2. Get GitHub user
    const userRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailsRes = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const profile = userRes.data;
    const emailObj = emailsRes.data.find(e => e.primary);

    // 3. Save or find user
    let user = await User.findOne({
      provider: 'github',
      providerId: profile.id,
    });

    if (!user) {
      user = await User.create({
        provider: 'github',
        providerId: profile.id,
        email: emailObj?.email || `${profile.login}@github.com`,
        name: profile.name || profile.login,
        avatarUrl: profile.avatar_url,
      });
    }

    // 4. Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Redirect to frontend
    res.redirect(`${process.env.CLIENT_URL}?token=${token}`);

  } catch (err) {
    console.log('OAuth Error:', err.response?.data || err.message);
    res.redirect(`${process.env.CLIENT_URL}/auth?error=oauth_failed`);
  }
});

/* =========================================================
   📁 FILE UPLOAD (MULTER)
========================================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /pdf|doc|docx|txt/;

  const ext = allowed.test(path.extname(file.originalname).toLowerCase());

  const mime =
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'text/plain' ||
    file.mimetype === 'application/msword' ||
    file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  if (ext && mime) cb(null, true);
  else cb(new Error('Only PDF, DOC, DOCX, TXT allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter,
});

// ---------------- UPLOAD ROUTE ----------------
app.post('/analyze', upload.single('document'), (req, res, next) => {
  try {
    if (!req.file) throw new Error('No file uploaded');

    res.json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

// ---------------- START SERVER ----------------
app.listen(5000, () => {
  console.log('Server running on port 5000');
});
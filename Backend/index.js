import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './model/user.js';
import analyzeController from './controllers/analyzeController.js';
import verifyToken from './middleware/auth.js';
import documentRoutes from './routes/documentRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: 'lexsimple', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@google.com`;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        provider: 'google',
        providerId: profile.id,
        email: email,
        name: profile.displayName || profile.username || 'Google User',
        avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      });
    } else if (user.provider !== 'google') {
      user.provider = 'google';
      user.providerId = profile.id;
      user.avatarUrl = user.avatarUrl || (profile.photos && profile.photos[0] ? profile.photos[0].value : '');
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: '/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`;
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        provider: 'github',
        providerId: profile.id,
        email: email,
        name: profile.displayName || profile.username || 'GitHub User',
        avatarUrl: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
      });
    } else if (user.provider !== 'github') {
      user.provider = 'github';
      user.providerId = profile.id;
      user.avatarUrl = user.avatarUrl || (profile.photos && profile.photos[0] ? profile.photos[0].value : '');
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(u => done(null, u)));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.CLIENT_URL}/auth?error=1` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ name: req.user.name, email: req.user.email }))}`);
  }
);

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL}/auth?error=1` }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, name: req.user.name, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ name: req.user.name, email: req.user.email }))}`);
  }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  if (extname && mimetype) return cb(null, true);
  else cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
};

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 }, fileFilter });

app.post('/api/v1/analyze', verifyToken, upload.single('document'), analyzeController.analyzeDocument);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1', verifyToken, chatRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(5000, () => console.log('Server running on port 5000'));
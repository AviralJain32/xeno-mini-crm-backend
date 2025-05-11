import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { checkUser } from '../controllers/auth.controller';
import { ApiResponse } from '../utils/ApiResponse';

dotenv.config();
const router = Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req: any, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    );

    // Set token in HTTP-only secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // set true in production
      sameSite: 'strict',
      maxAge: 3600 * 1000 * 24, // 1 hour
    });
    console.log('mai yaha hu');
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  },
);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/check', checkUser);

export default router;

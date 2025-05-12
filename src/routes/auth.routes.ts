import { Response, Router } from 'express';
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

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false }),
//   (req: any, res:Response) => {
//     const user = req.user;
//     const token = jwt.sign(
//       { id: user._id, email: user.email, name: user.name },
//       process.env.JWT_SECRET!,
//       { expiresIn: '24h' },
//     );

//     // Set token in HTTP-only secure cookie
//     res.cookie('token', token, {
//     httpOnly: true,
//     secure: true, 
//     sameSite: 'none',                              
//     maxAge: 3600 * 1000 * 24,  
//     path: '/',                   
//   });
//     console.log('mai yaha hu');
//     res.redirect(`${process.env.FRONTEND_URL}/dashboard/segments`);
//   },
// );

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req: any, res: Response) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    );

    console.log('[OAuth Callback] Generating JWT token:', token);

    // Set token in HTTP-only secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600 * 1000 * 24,
      path: '/',
    });

    console.log('[OAuth Callback] Cookie set with options:');
    console.log({
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 3600 * 1000 * 24,
      path: '/',
    });

    // Check response headers to see if cookie is included
    console.log('[OAuth Callback] Response headers:', res.getHeaders());

    console.log('[OAuth Callback] Redirecting to frontend:', `${process.env.FRONTEND_URL}/dashboard/segments`);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/segments?token=${token}`);
  },
);

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

router.get('/check', checkUser);

export default router;

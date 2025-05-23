import { Response, Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
  (req: any, res:Response) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    );

    // Set token in HTTP-only secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.APP_ENV === 'prod',
      sameSite: process.env.APP_ENV === 'prod' ? 'none' : 'lax',
      maxAge: 3600 * 1000 * 24, // 24 hours
      path: '/',
    });

    console.log('mai yaha hu');
    res.redirect(`${process.env.FRONTEND_URL}/login?token=${token}`);
  },
);


router.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.APP_ENV === 'prod',
    sameSite: process.env.APP_ENV === 'prod' ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out' });
});


export default router;

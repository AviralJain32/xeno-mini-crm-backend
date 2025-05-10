import { Request, Response } from 'express';

export const handleGoogleCallback = (_req: Request, res: Response) => {
  res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
};

export const getCurrentUser = (req: Request, res: Response) => {
  res.send(req.user);
};

export const logoutUser = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect('/');
  });
};

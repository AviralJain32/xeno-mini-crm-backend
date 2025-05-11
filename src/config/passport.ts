// src/config/passport.ts
import passport from 'passport';
import dotenv from 'dotenv';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { User, UserDocument } from '../models/user.model';

dotenv.config();

passport.serializeUser((user: Express.User, done) => {
  // Cast to UserDocument to access `.id`
  done(null, (user as UserDocument)._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err as Error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID:process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback,
    ): Promise<void> => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        done(null, newUser);
      } catch (error) {
        done(error as Error);
      }
    },
  ),
);

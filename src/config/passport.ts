// src/config/passport.ts
import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import { User, UserDocument } from '../models/user.model';

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
      clientID:
        '294812750606-b9c9suuio2ta05t15k73reijr03gnl17.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
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

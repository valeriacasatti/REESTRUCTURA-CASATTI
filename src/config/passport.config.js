import passport from "passport";
import localStrategy from "passport-local";
import { createHash, isValidPassword } from "../utils.js";
import { usersService } from "../dao/index.js";
import { config } from "./config.js";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

export const initializePassport = () => {
  //signup
  passport.use(
    "signupLocalStrategy",
    new localStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { name, lastame, age } = req.body;
        try {
          const user = await usersService.getUserByEmail(username);
          if (user) {
            //usuario ya registrado
            return done(null, false);
          }
          //usuario no registrado
          const newUser = {
            name,
            lastame,
            age,
            email: username,
            password: createHash(password),
          };
          const userCreated = await usersService.addUser(newUser);

          return done(null, userCreated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //signup with github
  passport.use(
    "signupGithubStrategy",
    new GithubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await usersService.getUserByEmail(profile._json.email);
          if (user) {
            return done(null, user);
          }
          const newUser = {
            name: profile._json.name,
            email: profile._json.email,
            password: createHash(profile.id),
          };
          const userCreated = await usersService.addUser(newUser);
          return done(null, userCreated);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //log in
  passport.use(
    "loginLocalStrategy",
    new localStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          const user = await usersService.getUserByEmail(username);
          if (!user) {
            //usuario no registrado
            return done(null, false);
          }
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }
          //luego de validar user registrado y contasena correcta
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //login with github
  passport.use(
    "loginGithubStrategy",
    new GithubStrategy(
      {
        clientID: config.github.clientId,
        clientSecret: config.github.clientSecret,
        callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`,
      },
      async (profile, done) => {
        try {
          const user = await usersService.getUserByEmail(profile._json.email);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  const cookieExtractor = (req) => {
    let token;
    if (req && req.cookies) {
      token = req.cookies["cookieToken"];
    } else {
      token = null;
    }
    return token;
  };

  //extraer token
  passport.use(
    "jwtAuth",
    new JWTStrategy(
      {
        //extraer info del token
        jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.token.privateKey,
      },
      async (jwtPayload, done) => {
        try {
          return done(null, jwtPayload); //req.user = info del token
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

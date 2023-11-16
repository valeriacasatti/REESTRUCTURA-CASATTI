import { Router } from "express";
import passport from "passport";
import { config } from "../config/config.js";
import { generateToken } from "../utils.js";

const router = Router();

//sign up
router.post(
  "/signUp",
  passport.authenticate("signupLocalStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-signup",
  }),
  async (req, res) => {
    res.render("logIn", {
      message: "user created successfully",
      style: "logIn.css",
    });
  }
);
router.get("/fail-signup", (req, res) => {
  res.render("signUp", {
    error: "error creating user",
    style: "signUp.css",
  });
});

//sign up with github
router.get("/signup-github", passport.authenticate("signupGithubStrategy"));
router.get(
  config.github.callbackUrl,
  passport.authenticate("signupGithubStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-signup",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res.cookie("cookieToken", token).render("profile", {
      style: "profile.css",
    });
  }
);

//log in
router.post(
  "/login",
  passport.authenticate("loginLocalStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-login",
  }),
  async (req, res) => {
    //token del usuario
    const token = generateToken(req.user);
    res
      .cookie("cookieToken", token)
      .json({ status: "success", message: "login successfully" });
  }
);

router.get("/fail-login", (req, res) => {
  res.render("logIn", {
    error: "log in error",
    style: "logIn.css",
  });
});

//log in up with github
router.get("/login-github", passport.authenticate("loginGithubStrategy"));
router.get(
  config.github.callbackUrl,
  passport.authenticate("loginGithubStrategy", {
    session: false,
    failureRedirect: "/api/sessions/fail-login",
  }),
  (req, res) => {
    const token = generateToken(req.user);
    res
      .cookie("cookieToken", token)
      .redirect("/profile", 200, { style: "profile.css" });
  }
);

//profile
router.post(
  "/profile",
  passport.authenticate("jwtAuth", {
    session: false,
    failureRedirect: "/api/sessions/fail-auth",
  }),
  async (req, res) => {
    try {
      res.json({ status: "success", message: "valid request", data: req.user });
    } catch (error) {
      console.log(error);
    }
  }
);

router.get("/fail-auth", (req, res) => {
  res.json({ status: "error", message: "invalid token" });
});

//logout
router.get("/logout", async (req, res) => {
  try {
    res.clearCookie("cookieToken");
    res.redirect("/", 200, { style: "logIn.css" });
  } catch (error) {
    res.render("profile", { error: "logout error", style: "profile.css" });
  }
});

export { router as sessionsRouter };

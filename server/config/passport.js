const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("./db");

console.log("========== GOOGLE CONFIG ==========");
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CALLBACK URL:", process.env.GOOGLE_CALLBACK_URL);
console.log(
  "SECRET LENGTH:",
  process.env.GOOGLE_CLIENT_SECRET?.length
);
console.log("===================================");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    async (accessToken, refreshToken, profile, done) => {
      console.log("================================");
      console.log("GOOGLE OAUTH SUCCESS");
      console.log("ACCESS TOKEN EXISTS:", !!accessToken);
      console.log("PROFILE ID:", profile.id);
      console.log("PROFILE EMAIL:", profile.emails?.[0]?.value);
      console.log("================================");

      try {
        // code database kau yang asal
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const fullname = profile.displayName;

        if (!email) {
          return done(new Error("Google account does not have an email."));
        }

        // 1. Check Google ID
        const [googleUser] = await db.promise().query(
          "SELECT * FROM users WHERE google_id = ?",
          [googleId]
        );

        if (googleUser.length > 0) {
          return done(null, googleUser[0]);
        }

        // 2. Check existing email
        const [existingUser] = await db.promise().query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );

        if (existingUser.length > 0) {
          await db.promise().query(
            "UPDATE users SET google_id = ? WHERE id = ?",
            [googleId, existingUser[0].id]
          );

          const updatedUser = {
            ...existingUser[0],
            google_id: googleId,
          };

          return done(null, updatedUser);
        }

        // 3. Create new user
        const [result] = await db.promise().query(
          `INSERT INTO users
          (fullname, email, phone, password, role, google_id)
          VALUES (?, ?, ?, ?, ?, ?)`,
         [
            fullname,
            email,
            "",
            "",
            "customer",
            googleId,
          ]
        );

        const newUser = {
          id: result.insertId,
          fullname,
          email,
          phone: null,
          role: "customer",
          google_id: googleId,
        };

        return done(null, newUser);

      } catch (error) {
        console.error("GOOGLE STRATEGY ERROR:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
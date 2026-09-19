require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const passport = require("./config/passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./config/db");

const app = express();
const ADMIN_EMAIL = "admin@dobisuramelati.com";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("CALLBACK:", process.env.GOOGLE_CALLBACK_URL);
console.log("SECRET EXISTS:", !!process.env.GOOGLE_CLIENT_SECRET);


// Middleware

app.use(express.json());
app.use(passport.initialize());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  "/uploads/profile",
  express.static(path.join(__dirname, "uploads/profile"))
);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "uploads/profile");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `profile_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });
const uploadProfile = multer({ storage: profileStorage });

// Base Route
app.get("/", (req, res) => res.send("Server Running"));

// Auth Routes
app.post("/register", (req, res) => {
  const { fullname, email, phone, password } = req.body;

  if (email === ADMIN_EMAIL) {
    return res.status(400).json({ message: "Admin email is reserved" });
  }

  const checkSql = "SELECT * FROM users WHERE email = ?";
  db.query(checkSql, [email], async (err, result) => {
    if (err) {
      console.error("MYSQL ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const sql = `
      INSERT INTO users (fullname, email, phone, password, role)
      VALUES (?, ?, ?, ?, 'customer')
    `;

    db.query(sql, [fullname, email, phone, hashPassword], (err) => {
      if (err) {
        console.error("MYSQL ERROR:", err);
        return res.status(500).json({ message: "Register failed" });
      }
      res.json({ message: "Register Success" });
    });
  });
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const userData = {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profile_image: user.profile_image || null,
    };

    const encodedUser = encodeURIComponent(
      JSON.stringify(userData)
    );

    res.redirect(
      `${process.env.FRONTEND_URL}/google-success?token=${token}&user=${encodedUser}`
    );
  }
);

app.post("/login", (req, res) => {

  console.log("===== LOGIN REQUEST =====");
  console.log("EMAIL:", req.body.email);
  console.log("PASSWORD RECEIVED:", !!req.body.password);

  const { email, password } = req.body;
  const sql = "SELECT * FROM users WHERE email = ?";

db.query(sql, [email], async (err, result) => {

    if (err) {
        console.error("MYSQL ERROR:", err);
        return res.status(500).json({ message: "Database error" });
    }

    console.log("DATABASE RESULT COUNT:", result.length);

    if (result.length === 0) {
        console.log("EMAIL NOT FOUND:", email);
        return res.status(400).json({ message: "Email not found" });
    }

    const user = result[0];

    console.log("USER FOUND:", user.email);
    console.log("ROLE:", user.role);

    const checkPassword = await bcrypt.compare(password, user.password);

    console.log("PASSWORD MATCH:", checkPassword);

    if (!checkPassword) {
        console.log("WRONG PASSWORD");
        return res.status(400).json({ message: "Wrong password" });
    }

    console.log("LOGIN SUCCESS");

    res.json({
        message: "Login Success",
        user: {
            id: user.id,
            user_id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            profile_image: user.profile_image,
            role: user.role,
        },
    });
});
});

// Profile Routes
app.get("/profile/:id", (req, res) => {
  const sql = "SELECT id, fullname, email, phone, profile_image FROM users WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result[0] || null);
  });
});

app.put("/profile/:id", uploadProfile.single("profile_image"), (req, res) => {

    const userId = req.params.id;
    const { fullname, email, phone } = req.body;

    console.log("========== UPDATE PROFILE ==========");
    console.log("USER ID:", userId);
    console.log("FULLNAME:", fullname);
    console.log("EMAIL:", email);
    console.log("PHONE:", phone);

    let sql = `
        UPDATE users
        SET fullname = ?, email = ?, phone = ?
    `;

    let values = [fullname, email, phone];

    if (req.file) {
        sql += `, profile_image = ?`;
        values.push(req.file.filename);

        console.log("PROFILE IMAGE:", req.file.filename);
    }

    sql += ` WHERE id = ?`;
    values.push(userId);

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error("UPDATE PROFILE ERROR:", err);

            return res.status(500).json({
                message: "Failed to update profile"
            });
        }

        console.log("PROFILE UPDATE SUCCESS");

        // =====================================
        // CREATE NOTIFICATION
        // =====================================

        const notificationSQL = `
            INSERT INTO notifications
            (user_id, message, is_read)
            VALUES (?, ?, ?)
        `;

        const notificationMessage =
            "Your profile has been updated successfully.";

        db.query(
            notificationSQL,
            [userId, notificationMessage, 0],
            (err, result) => {

                if (err) {

                    console.error(
                        "========== NOTIFICATION ERROR =========="
                    );

                    console.error(err);

                    return res.status(500).json({
                        message: "Profile updated but notification failed"
                    });
                }

                console.log(
                    "========== NOTIFICATION CREATED =========="
                );

                console.log("Notification ID:", result.insertId);
                console.log("User ID:", userId);
                console.log("Message:", notificationMessage);

                res.json({
                    message: "Profile updated successfully",
                    notification: "Notification created successfully",
                    profile_image: req.file
                        ? req.file.filename
                        : null
                });

            }
        );

    });

});

// Customer Complaints Routes
app.post("/submit-complaint", upload.single("image"), (req, res) => {
  const { user_id, title, category, description } = req.body;
  const image = req.file ? req.file.filename : null;

  // Set status awal sebagai 'Pending' (Huruf Besar 'P')
  const sql = `
    INSERT INTO complaints (user_id, title, category, description, image, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
  `;

  db.query(sql, [user_id, title, category, description, image], (err) => {
    if (err) {
      console.error("MYSQL ERROR:", err);
      return res.status(500).json({ message: "Failed to submit complaint" });
    }
    res.json({ message: "Complaint submitted successfully" });
  });
});

app.get("/my-complaints/:user_id", (req, res) => {
  const sql = "SELECT * FROM complaints WHERE user_id = ? ORDER BY complaint_id DESC";
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

app.get("/track-complaint/:user_id", (req, res) => {
  const sql = `
    SELECT complaint_id, title, category, status, admin_reply, created_at
    FROM complaints
    WHERE user_id = ?
    ORDER BY complaint_id DESC
  `;
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to load complaint status" });
    res.json(result);
  });
});

app.get("/approved-complaints/:user_id", (req, res) => {
  const sql = `
    SELECT * FROM complaints
    WHERE user_id = ? AND LOWER(status) = 'resolved'
    ORDER BY created_at DESC
  `;
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Customer Dashboard Route 
app.get("/dashboard/:id", (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN LOWER(REPLACE(status, ' ', '')) = 'inprogress' THEN 1 ELSE 0 END) AS progress,
      SUM(CASE WHEN LOWER(status) = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM complaints
    WHERE user_id = ?
  `;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("DATABASE ERROR:", err);
      return res.status(500).json({ message: "Database error" });
    }

    const row = result[0] || {};
    const countProgress = Number(row.progress || 0);

    res.json({
      total: Number(row.total || 0),
      pending: Number(row.pending || 0),
      progress: countProgress,
      in_progress: countProgress,
      inProgress: countProgress,
      resolved: Number(row.resolved || 0),
    });
  });
});

// Feedback Routes
app.post("/feedback", (req, res) => {
  const { complaint_id, rating, comment } = req.body;
  const sql = "INSERT INTO feedback (complaint_id, rating, comment) VALUES (?, ?, ?)";

  db.query(sql, [complaint_id, rating, comment], (err) => {
    if (err) return res.status(500).json({ message: "Feedback failed" });
    res.json({ message: "Feedback submitted successfully" });
  });
});

app.get("/check-feedback/:user_id", (req, res) => {
  const sql = `
    SELECT c.complaint_id
    FROM complaints c
    LEFT JOIN feedback f ON c.complaint_id = f.complaint_id
    WHERE c.user_id = ? AND LOWER(c.status) = 'resolved' AND f.id IS NULL
  `;
  db.query(sql, [req.params.user_id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({ unsubmitted: result.length > 0 });
  });
});

app.get("/my-feedback/:id", (req, res) => {
  const sql = `
    SELECT f.id, f.rating, f.comment, f.created_at, c.title
    FROM feedback f
    JOIN complaints c ON f.complaint_id = c.complaint_id
    WHERE c.user_id = ?
    ORDER BY f.created_at DESC
  `;
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

// Admin Routes
app.get("/complaints", (req, res) => {
  const sql = `
    SELECT complaints.*, users.fullname
    FROM complaints
    JOIN users ON complaints.user_id = users.id
    ORDER BY complaint_id DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

app.put("/update-status/:id", (req, res) => {
  const id = req.params.id;
  let { status, admin_reply } = req.body;

  // Formatkan status mengikut ENUM database
  if (status && status.toLowerCase().includes("progress")) {
    status = "In Progress";
  } else if (status && status.toLowerCase() === "pending") {
    status = "Pending";
  } else if (status && status.toLowerCase() === "resolved") {
    status = "Resolved";
  }

  const updateSql = "UPDATE complaints SET status = ?, admin_reply = ? WHERE complaint_id = ?";
  db.query(updateSql, [status, admin_reply, id], (err) => {
    if (err) return res.status(500).json({ message: "Update failed" });

    const getComplaintSql = "SELECT user_id, title FROM complaints WHERE complaint_id = ?";
    db.query(getComplaintSql, [id], (err, complaintResult) => {
      if (err || complaintResult.length === 0) {
        return res.status(404).json({ message: "Complaint not found" });
      }

      const { user_id: userId, title } = complaintResult[0];
      const message = `Your complaint "${title}" is now ${status}.`;
      const notificationSql = `
        INSERT INTO notifications (user_id, message, is_read, created_at)
        VALUES (?, ?, 0, NOW())
      `;

      db.query(notificationSql, [userId, message], (err) => {
        if (err) return res.status(500).json({ message: "Complaint updated but notification failed" });
        res.json({ message: "Complaint updated and notification created" });
      });
    });
  });
});

app.get("/admin-stats", (req, res) => {
  const sql = `
    SELECT 
      COUNT(*) AS total,
      SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN LOWER(REPLACE(status, ' ', '')) = 'inprogress' THEN 1 ELSE 0 END) AS progress,
      SUM(CASE WHEN LOWER(status) = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM complaints
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json({
      total: Number(result[0].total || 0),
      pending: Number(result[0].pending || 0),
      progress: Number(result[0].progress || 0),
      resolved: Number(result[0].resolved || 0),
    });
  });
});

app.get("/admin-complaints", (req, res) => {
  const sql = `
    SELECT complaints.complaint_id, complaints.title, complaints.category, complaints.status, complaints.created_at, users.fullname
    FROM complaints
    JOIN users ON complaints.user_id = users.id
    ORDER BY complaints.created_at DESC
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result);
  });
});

app.get("/reports", (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total_complaints,
      SUM(CASE WHEN LOWER(status) = 'pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN LOWER(REPLACE(status, ' ', '')) = 'inprogress' THEN 1 ELSE 0 END) AS progress,
      SUM(CASE WHEN LOWER(status) = 'resolved' THEN 1 ELSE 0 END) AS resolved
    FROM complaints
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(result[0]);
  });
});

app.get("/notifications/:user_id", (req, res) => {

    const userId = req.params.user_id;

    const sql = `
        SELECT *
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("GET NOTIFICATIONS ERROR:", err);

            return res.status(500).json({
                message: "Failed to get notifications"
            });
        }

        res.json(result);
    });
});

app.put("/notifications/read-all/:user_id", (req, res) => {

    const userId = req.params.user_id;

    const sql = `
        UPDATE notifications
        SET is_read = 1
        WHERE user_id = ? AND is_read = 0
    `;

    db.query(sql, [userId], (err, result) => {

        if (err) {
            console.error("MARK ALL READ ERROR:", err);

            return res.status(500).json({
                message: "Failed to mark notifications as read"
            });
        }

        res.json({
            message: "All notifications marked as read",
            updated: result.affectedRows
        });

    });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
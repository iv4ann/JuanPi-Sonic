const express = require("express");
const mysql = require("mysql2");
const session = require("express-session");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Sesiones
app.use(
  session({
    secret: "secreto_proyecto",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
    },
  }),
);

// Conexión MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "orrico_dinero",
});

db.connect((err) => {
  if (err) {
    console.error("Error DB:", err);
  } else {
    console.log("Conectado a MySQL");
  }
});

// Middleware auth
function auth(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login.html");
  }
  next();
}

// RUTA PRINCIPAL
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

// AUTENTICACIÓN

// Registro
app.post("/registro", async (req, res) => {
  let { nombre, email, password } = req.body;

  // limpiar espacios
  nombre = nombre ? nombre.trim() : "";
  email = email ? email.trim() : "";
  password = password ? password.trim() : "";

  // validación
  if (nombre === "" || email === "" || password === "") {
    return res.redirect("/login.html?error=empty");
  }

  try {
    const hash = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO clientes777 (nombre, email, password) VALUES (?, ?, ?)",
      [nombre, email, hash],
      (err) => {
        if (err) {
          console.error(err);
          return res.redirect("/login.html?error=server");
        }
        res.redirect("/login.html");
      },
    );
  } catch (error) {
    console.error(error);
    res.redirect("/login.html?error=server");
  }
});

// Login
app.post("/login", (req, res) => {
  let { email, password } = req.body;

  // limpiar espacios
  email = email ? email.trim() : "";
  password = password ? password.trim() : "";

  // validación
  if (email === "" || password === "") {
    return res.redirect("/login.html?error=empty");
  }

  db.query(
    "SELECT * FROM clientes777 WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.redirect("/login.html?error=server");
      }

      if (results.length === 0) {
        return res.redirect("/login.html?error=invalid");
      }

      const user = results[0];

      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.redirect("/login.html?error=invalid");
        }

        req.session.user = user;
        return res.redirect("/dashboard");
      } catch (error) {
        console.error(error);
        return res.redirect("/login.html?error=server");
      }
    },
  );
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login.html");
});

// CRUD SERVICIOS

// CREATE
app.post("/servicios", auth, (req, res) => {
  const { tipo_servicio, ubicacion, precio } = req.body;
  const cliente_id = req.session.user.id;

  db.query(
    "INSERT INTO servicios (tipo_servicio, ubicacion, precio, cliente_id) VALUES (?, ?, ?, ?)",
    [tipo_servicio, ubicacion, precio, cliente_id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error del servidor");
      }
      res.sendStatus(200);
    },
  );
});

// READ
app.get("/servicios", auth, (req, res) => {
  const cliente_id = req.session.user.id;

  db.query("SELECT * FROM servicios ", [cliente_id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error del servidor");
    }
    res.json(results);
  });
});

// UPDATE
app.put("/servicios/:id", auth, (req, res) => {
  const { tipo_servicio, ubicacion, precio } = req.body;
  const { id } = req.params;

  db.query(
    "UPDATE servicios SET tipo_servicio=?, ubicacion=?, precio=? WHERE id=?",
    [tipo_servicio, ubicacion, precio, id],
    (err) => {
      if (err) return res.status(500).send("Error del servidor");
      res.sendStatus(200);
    },
  );
});

// DELETE
app.delete("/servicios/:id", auth, (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM servicios WHERE id=?", [id], (err) => {
    if (err) return res.status(500).send("Error del servidor");
    res.sendStatus(200);
  });
});

// PROTEGER HTML
app.get("/dashboard", auth, (req, res) => {
  res.sendFile(__dirname + "/public/dashboard.html");
});

// SERVIDOR

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

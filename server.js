const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 🔹 Sesiones
app.use(session({
  secret: 'secreto_proyecto',
  resave: false,
  saveUninitialized: false
}));

// 🔹 Conexión MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'orrico_dinero'
});

db.connect(err => {
  if (err) {
    console.error('Error DB:', err);
  } else {
    console.log('Conectado a MySQL');
  }
});

// 🔐 Middleware auth
function auth(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

// =======================
// 🏠 RUTA PRINCIPAL
// =======================
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// =======================
// 🔐 AUTENTICACIÓN
// =======================

// Registro
app.post('/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  db.query(
    'INSERT INTO clientes777 (nombre, email, password) VALUES (?, ?, ?)',
    [nombre, email, hash],
    (err) => {
      if (err) return res.send(err);
      res.redirect('/login.html');
    }
  );
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM clientes777 WHERE email = ?', [email], async (err, results) => {
    if (err) return res.send(err);

    if (results.length === 0) {
      return res.send('Usuario no existe');
    }

    const user = results[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send('Contraseña incorrecta');
    }

    req.session.user = user;

    res.redirect('/dashboard.html');
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login.html');
});

// =======================
// 🔁 CRUD SERVICIOS
// =======================

// ➕ CREATE
app.post('/servicios', auth, (req, res) => {
  const { tipo_servicio, ubicacion, precio } = req.body;
  const cliente_id = req.session.user.id;

  db.query(
    'INSERT INTO servicios (tipo_servicio, ubicacion, precio, cliente_id) VALUES (?, ?, ?, ?)',
    [tipo_servicio, ubicacion, precio, cliente_id],
    (err) => {
      if (err) return res.send(err);
      res.sendStatus(200);
    }
  );
});

// 📊 READ
app.get('/servicios', auth, (req, res) => {
  const cliente_id = req.session.user.id;

  db.query(
    'SELECT * FROM servicios WHERE cliente_id = ?',
    [cliente_id],
    (err, results) => {
      if (err) return res.send(err);
      res.json(results);
    }
  );
});

// ✏️ UPDATE
app.post('/servicios/update/:id', auth, (req, res) => {
  const { tipo_servicio, ubicacion, precio } = req.body;
  const { id } = req.params;

  db.query(
    'UPDATE servicios SET tipo_servicio=?, ubicacion=?, precio=? WHERE id=?',
    [tipo_servicio, ubicacion, precio, id],
    (err) => {
      if (err) return res.send(err);
      res.sendStatus(200);
    }
  );
});

// ❌ DELETE
app.get('/servicios/delete/:id', auth, (req, res) => {
  const { id } = req.params;

  db.query(
    'DELETE FROM servicios WHERE id=?',
    [id],
    (err) => {
      if (err) return res.send(err);
      res.sendStatus(200);
    }
  );
});

// =======================
// 🚀 SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
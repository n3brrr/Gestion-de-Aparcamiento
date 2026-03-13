import express from 'express';
import AparcamientoDAO from '../database/aparcamiento-dao.js';
import UsuarioDAO from '../database/usuario-dao.js';

const router = express.Router();

const aparcamientoDB = new AparcamientoDAO('datos.sqlite');
const usuarioDB = new UsuarioDAO('datos.sqlite');

// Ruta principal: carga la página de inicio
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Mi Aparcamiento PWA'
  });
});

router.get('/historial', (req, res) => {
  res.render('historial', {
    title: 'Historial de Aparcamientos'
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Iniciar Sesión'
  });
});

// Gestión del login: validación estricta para usuario admin
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    // Si coincide exactamente, iniciamos sesión
    let user = usuarioDB.obtenerPorUsername('admin');
    if (!user) {
      usuarioDB.crear('admin', 'admin');
      user = usuarioDB.obtenerPorUsername('admin');
    }
    
    req.session.user = {
      id: user.id,
      username: user.username
    };
    console.log("Login exitoso como admin");
    return res.redirect('/');
  } else {
    // Si no es admin/admin, borramos cualquier rastro y devolvemos error
    req.session.user = null;
    console.log("Login fallido con:", username, password);
    return res.render('login', {
      title: 'Iniciar Sesión',
      error: 'Credenciales inválidas. Solo el administrador (admin/admin) puede acceder.'
    });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/api/aparcamientos', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      error: 'Modo local. No se guarda en remoto.'
    });
  }

  const {
    lat,
    lng,
    timestamp
  } = req.body;
  const id = aparcamientoDB.crear(req.session.user.id, lat, lng, timestamp);
  res.json({
    success: true,
    insertId: id
  });
});

router.get('/api/aparcamientos', (req, res) => {
  if (!req.session.user) {
    return res.json([]);
  }
  const historial = aparcamientoDB.obtenerPorUsuario(req.session.user.id);
  res.json(historial);
});

export default router;
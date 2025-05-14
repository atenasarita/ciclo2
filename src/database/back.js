import express from 'express';
import cors from 'cors';
import { pool } from './bd.js';

const app = express();

app.use(cors());
app.use(express.json());

// Endpoints
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Username recibido:", username);

    // Validamos
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length > 0) {
      return res.json({ message: 'Login correcto' }); 
    } else {
      return res.status(401).json({ message: 'Login incorrecto' });
    }

  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
////sign up
app.post('/signup', async (req, res) => {
  try {
    const { name, surname1, surname2 } = req.body;

    console.log("Username recibido:", name);

    // Validacion
    const result = await pool.query("INSERT INTO users (user_id, username, first_name) VALUES ($1, $2, $3)", [name, surname1, surname2]);
    return res.json({ message: 'signup correcto' }); //mensaje
    
    // if (result.rows.length > 0) {
    //   return res.json({ message: 'signup correcto' }); 
    // } else {
    //   return res.status(401).json({ message: 'signup incorrecto' });
    // }

  } catch (error) {
    console.error("Error en /signup:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

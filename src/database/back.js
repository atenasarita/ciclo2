import express from 'express';
import cors from 'cors';
import { pool } from './bd.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';

const app = express();
const SECRET ="SECRETO"//preguntar si esta bien guardar SECRET asi para el token en una variable de ambiente, punto m
app.use(cors());
app.use(express.json());
//falta pasar a base de datos correcta
//falta poner mas cosas a cada rol

// Endpoints
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Username recibido:", username);
    //falta poner una autenticacion con username y password y despues regresar el proceso del token pero ya no hacer return con username y password

    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    const useridResult = await pool.query("SELECT user_id FROM users WHERE username=$1", [username]);
    const userid = useridResult.rows[0].user_id;
    
    const newUser = await pool.query("SELECT role FROM roles WHERE user_id = $1", [userid]);
    
    const role = newUser.rows[0]?.role;
    console.log(role)

    if(role !== 'Usuario'){
      return res.status(403).json({ message: 'Acceso denegado: rol no permitido' });
      
    }
    const payload = {
      id: role.user_id,
      username: role.username,
      role
    };

    const token = jwt.sign(payload, SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login correcto', token });

  } catch (error) {
    console.error("Error en /login:", error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
////sign up
app.post('/signup', async (req, res) => {
  try {
    const { name, surname1, surname2 } = req.body;
    const hashedpassword = await bcrypt.hash(surname1, 10);
    console.log("Hash generado:", hashedpassword); 
    console.log("Username recibido:", name);

    // Validacion
    const result = await pool.query("INSERT INTO users (user_id, username, first_name) VALUES ($1, $2, $3)", [name, surname1, hashedpassword]);
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

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { pool } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

const SECRET ="SECRETO"//preguntar si esta bien guardar SECRET asi para el token en una variable de ambiente, punto m
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&.#^_-]{8,}$/;

//falta poner mas cosas a cada rol

// endpoint para login al usuario (verifica el match de usuario existente y password)
app.post('/login', async (req, res) => { 
  const { username, password } = req.body; 

  if (!username || !password) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  } 
  
  try {
    // Buscar por correo o número de empleado 
    const result = await pool.query('SELECT * FROM empleados WHERE correo = $1 OR numero_empleado = $1', [username]); 
    
    if (result.rows.length === 0){
      return res.status(401).json({ error: 'Wrong email/employee number or password.' });
    }
    
    const user = result.rows[0]; 
    
    const validPassword = await bcrypt.compare(password, user.contraseña);

    if(!user.approved){
      return res.status(401).json({ error: "Your account hasn't been verified by an administrator. You'll be notified once your account is approved." });
    }
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Wrong email/employee number or password.' });
    }
  
    // Crear el token
    const token = jwt.sign({
      id: user.id,
      nombre: user.nombre,
      es_admin: user.es_admin }, SECRET, { expiresIn: '2h' });
  
      res.json({ token });

  } catch (err) {
      console.error('Could not authenticate:', err); 
      res.status(500).json({ error: 'Internal Server Error' }); 
  } 
});

// sign up
app.post('/signup', async (req, res) => {
  const { nombre, primer_apellido, segundo_apellido, correo, numero_empleado, contraseña, confirma_contraseña } = req.body;
  const hashedpassword = await bcrypt.hash(contraseña, 10);

  try {
    if (!passwordRegex.test(contraseña)) {
      return res.status(400).json({ 
        error: 'Your password must be alphanumeric and at least 8 characters long (Optional Characters: @ $ ! % * ? & .)' });
    }

    if (contraseña !== confirma_contraseña) {
      return res.status(400).json({ error: "Passwords don't match." });
    };

    // Validacion
    await pool.query('CALL insert_empleado($1, $2, $3, $4, $5, $6)', [nombre, primer_apellido, segundo_apellido, correo, numero_empleado, hashedpassword]);


    // enviar correo a admins sobre nuevo request
    const result = await pool.query('SELECT correo FROM empleados WHERE es_admin = true');
    const admin_emails = result.rows.map(admin => admin.correo);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin_emails,
      subject: 'Correo de prueba',
      text: 'tienes un nuevo user para approve',
    });

    return res.json({ message: 'signup correcto' }); 

  } catch (error) {
    console.error("Failed to sign up:", error);

    if (error.code === 'P2001') {
      return res.status(400).json({ error: 'This employee number is already registered.' });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'This email is already registered.' });
    } 

    if (error.code === '23514'){
      return res.status(400).json({ error: 'Fill in all required fields'});
    }

    res.status(500).json({ error: 'Internal Server Error' });

  }
});

// approval cards
app.get('/no_aprobados', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleados WHERE approved = false');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// approve usuario
app.post('/approve_empleado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL approve_empleado($1)', [id]);

    const result = await pool.query('SELECT correo FROM empleados WHERE id = ($1)', [id]);
    const reciever = result.rows[0]?.correo;
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: reciever,
      subject: 'Correo de prueba',
      text: 'tu cuenta ha sido approved',
    });

    res.status(201).json({ message: 'User successfully approved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to approve user.' });
  }
});

app.post('/reject_empleado/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('CALL reject_empleado($1)', [id]);

    res.status(201).json({ message: 'User successfully rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to reject user.' });
  }
});


// forgot password
import crypto from 'crypto';// Para generar la OTP
import { log } from 'console';

// 
app.post('/request-reset', async (req, res) => {
  const { correo } = req.body;

  try {
    // verifica si el usuario existe
    const user = await pool.query('SELECT * FROM empleados WHERE correo = $1', [correo]);
    const userIsApproved = user.rows[0].approved;

    if (user.rows.length === 0 || !userIsApproved) {
      return res.status(404).json({ error: 'This email address is not linked to any approved accounts.' });
    } 

    // Genera una OTP de 6 dígitos
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Guarda la OTP temporalmente (puedes usar una tabla password_resets)
    await pool.query(`
      INSERT INTO password_resets (correo, otp, created_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT (correo)
      DO UPDATE SET otp = EXCLUDED.otp, created_at = EXCLUDED.created_at
    `, [correo, otp]);

    // Enviar la OTP al correo (aquí puedes usar nodemailer)
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: correo.trim(),
      subject: 'Correo de prueba',
      text: `OTP generada para ${correo}: ${otp}`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });

  } catch (err) {
    console.error('Failed to generate OTP:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});


app.post('/verify-otp', async (req, res) => {
  const { correo, otp } = req.body;

  try {
    const result = await pool.query(`
      SELECT otp, created_at
      FROM password_resets
      WHERE correo = $1
    `, [correo]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'No se encontró una OTP para este correo' });
    }

    const { otp: otpGuardada, created_at } = result.rows[0];

    // Validar que la OTP coincida
    if (otp !== otpGuardada) {
      return res.status(401).json({ error: 'Wrong OTP. Please verify or try again later.' });
    }

    // Validar si la OTP ha expirado (ej. 10 minutos de validez)
    const ahora = new Date();
    const creada = new Date(created_at);
    const diferenciaMin = (ahora - creada) / 1000 / 60;

    if (diferenciaMin > 10) {
      return res.status(401).json({ error: 'OTP has expired' });
    }

    // Opcional: borrar la OTP después de verificar
    await pool.query(`DELETE FROM password_resets WHERE correo = $1`, [correo]);

    res.status(200).json({ message: 'OTP has been verified.' });

  } catch (err) {
    console.error('Failed to verify OTP:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verifica que el correo exista
    const userResult = await pool.query( 'SELECT contraseña FROM empleados WHERE correo = $1', [email] );
  
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // is previous password the same as the og password? 
    const storedHashedPassword = userResult.rows[0].contraseña;
    const isSamePassword = await bcrypt.compare(password, storedHashedPassword);

    if (isSamePassword) {
      return res.status(401).json({ error: "New password can't be old password." });
    }

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Your password must be alphanumeric and at least 8 characters long (Optional Characters: @ $ ! % * ? & .)'
      });
    }    

    const hashedpassword = await bcrypt.hash(password, 10);

    // Actualiza la contraseña en texto plano (solo para desarrollo)
    await pool.query('UPDATE empleados SET contraseña = $1 WHERE correo = $2', [password, email]);

    // Limpia cualquier OTP asociada a ese correo (opcional)
    await pool.query('DELETE FROM password_resets WHERE correo = $1', [email]);

    res.status(200).json({ message: 'Your new password has been saved.' });

  } catch (err) {
    console.error('Failed to save new password:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

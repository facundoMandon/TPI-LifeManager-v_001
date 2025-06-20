import { User } from '../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // carga variables del .env

const SECRET_KEY = process.env.SECRET_KEY;

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // genero el token
    const payload = {
      id: user.id,
      rol: user.rol,
      email: user.email
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
console.log("Payload usado para token:", payload);
console.log("Token generado:", token);

 // envio el token y los datos del usuario
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      rol: user.rol
    };

    res.status(200).json({ message: 'Login exitoso', user: userData, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, rol } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el nuevo usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      rol
    });

    // genero el token
    const payload = {
      id: newUser.id,
      rol: newUser.rol,
      email: newUser.email
    };
    

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

    //Envio token + datos
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rol: newUser.rol
      },
      token
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

import { User } from '../models/Users.js';
import bcrypt from 'bcrypt';


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

    // No devuelvas la contraseña
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      rol: user.rol
    };

    res.status(200).json({ message: 'Login exitoso', user: userData });
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
    const newUser = await User.create({ name, email, password, rol });
    res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Opcional: podés generar y devolver un token JWT acá
    res.json({ message: 'Login exitoso', user });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

import { User } from '../models/Users.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; // 👈 Importá JWT

export const createUser = async (req, res) => {
  try {
    const { name, email, password, rol } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('El usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      rol,
    });

    // ✅ Crear token JWT
    const token = jwt.sign(
      { id: newUser.id, rol: newUser.rol },
      process.env.JWT_SECRET || "secreto", // ← usa .env o fallback para desarrollo
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        rol: newUser.rol,
      },
      token, // ← 🔥 Devolvés el token
    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).send('Error interno del servidor');
  }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        console.log("Users:", users);
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const getUserById = async (req, res) => {
    const { id } = req.params; // Obtengo el id del usuario desde los parámetros de la solicitud
    try {
        const user = await User.findByPk(id); // Busco el usuario por su id
        if (!user) { // Si no se encuentra el usuario, retorno un error 404
            return res.status(404).send('User not found');
        }
        res.json(user); // Si se encuentra, retorno el usuario en formato JSON
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params; // Obtengo el id del usuario desde los parámetros de la solicitud
    try {
        const [updated] = await User.update(req.body, { // Actualizo el usuario con los datos del cuerpo de la solicitud
            where: { id }
        });
        if (!updated) { // Si no se actualiza ningún usuario, retorno un error 404
            return res.status(404).send('User not found');
        }
        const updatedUser = await User.findByPk(id); // Busco el usuario actualizado
        res.json(updatedUser); // Retorno el usuario actualizado en formato JSON
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const deleteUser = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Obtengo el id del usuario desde los parámetros de la solicitud
    try {
        const deleted = await User.destroy({ // Elimino el usuario por su id
            where: { id } // donde id es el id del usuario a eliminar
        });
        if (!deleted) { // Si no se elimina ningún usuario, retorno un error 404
            return res.status(404).send('User not found');
        }
        res.sendStatus(204); // Retorno un estado 204 No Content si la eliminación fue exitosa
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}

export const getUserByEmail = async (req, res) => {
    const { email } = req.params; // Obtengo el email del usuario desde los parámetros de la solicitud
    try {
        const user = await User.findOne({ // Busco el usuario por su email
            where: { email }
        });
        if (!user) { // Si no se encuentra el usuario, retorno un error 404
            return res.status(404).send('User not found');
        }
        res.json(user); // Si se encuentra, retorno el usuario en formato JSON
    } catch (error) {
        console.error('Error fetching user by email:', error);
        res.status(500).send('Internal Server Error'); // Si ocurre un error, retorno un error 500
    }
}
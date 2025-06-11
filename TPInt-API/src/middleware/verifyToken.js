import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // busca el header
  const token = authHeader && authHeader.split(' ')[1]; // extrae el token

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log("Token decodificado:", decoded); 
    req.user = decoded; // lo guardamos en el request
    next(); // continuamos con el siguiente middleware o controlador
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    return res.status(403).json({ message: 'Token inválido' });
  }
};

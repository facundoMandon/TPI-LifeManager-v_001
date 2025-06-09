import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const requireRole = (role) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ message: 'Token requerido' });

      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Decoded JWT en requireRole:", decoded);

      if (decoded.rol !== role) {
        return res.status(403).json({ message: 'No tienes permiso para acceder a este recurso' });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error('Error en requireRole:', error);
      res.status(403).json({ message: 'Token inválido o expirado' });
    }
  };
};

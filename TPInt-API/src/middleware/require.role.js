export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.rol !== role) {
      return res.status(403).json({ message: "Acceso denegado: rol insuficiente" });
    }
    next();
  };
};

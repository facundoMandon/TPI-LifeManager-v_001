// src/middleware/require.role.js

export const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log('--- Iniciando requireRole middleware ---');

        // Verifico si req.user y req.user.rol existen
        if (!req.user || !req.user.rol) {
            console.error('RequireRole: req.user o req.user.rol no definidos. Esto puede indicar un token inválido o que verifyToken no se ejecutó correctamente.');
            return res.status(403).json({ message: 'Acceso denegado: Rol de usuario no identificado.' });
        }

        const userRole = req.user.rol;
        console.log(`RequireRole: Rol del usuario autenticado: '${userRole}' (Tipo: ${typeof userRole})`);
        console.log(`RequireRole: Roles permitidos (allowedRoles):`, allowedRoles, `(Tipo: ${Array.isArray(allowedRoles) ? 'Array' : typeof allowedRoles})`);

        // Realizo la verificación del rol
        if (Array.isArray(allowedRoles)) {
            // Si `allowedRoles` es un array (ej. ['admin', 'superadmin'])
            if (allowedRoles.includes(userRole)) {
                console.log(`RequireRole: Rol '${userRole}' permitido para esta acción.`);
                next(); // Continúa con la siguiente función en la cadena de middlewares
            } else {
                console.warn(`RequireRole: Acceso denegado. Rol '${userRole}' no está en la lista de roles permitidos: [${allowedRoles.join(', ')}].`);
                return res.status(403).json({ message: 'No tienes los permisos necesarios para realizar esta acción.' });
            }
        } else {
            // Si `allowedRoles` es una cadena simple (ej. 'superadmin')
            if (userRole === allowedRoles) {
                console.log(`RequireRole: Rol '${userRole}' permitido para esta acción.`);
                next(); // Continúa con la siguiente función en la cadena de middlewares
            } else {
                console.warn(`RequireRole: Acceso denegado. Rol '${userRole}' no es igual al rol requerido: '${allowedRoles}'.`);
                return res.status(403).json({ message: 'No tienes los permisos necesarios para realizar esta acción.' });
            }
        }
        console.log('--- Finalizando requireRole middleware ---');
    };
};

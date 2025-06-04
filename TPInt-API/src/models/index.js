// Dentro de este index voy a guardar las relaciones entre tablas.
// Es util porque exporto un unico archivo luego, que es este hacia el index.js de la app.
// y tambien me aseguro que todo se exporte al mismo tiempo, y no una tabla primero y luego otra
// pues eso daria lugar a espacios vacios o undefined en ciertos casos.

import { Section }  from "./Section.js";
import { Project }  from "./Projects.js";
import { Tasks }  from "./Tasks.js";
import { Entry }  from "./entry.js";
import { User }  from "./Users.js";

// Relaciones
//Relacion Section-Entry
Section.hasMany(Entry, {
  foreignKey: "sectionId",
  sourceKey: "id",
});
Entry.belongsTo(Section, {
  foreignKey: "sectionId",
  targetKey: "id",
});

//Relacion Project-Tasks
Project.hasMany(Tasks, {
  foreignKey: "projectId",
  sourceKey: "id",
});

Tasks.belongsTo(Project, {
  foreignKey: "projectId",
  targetKey: "id",
});

// Relacion Usuario-Proyectos
User.hasMany(Project, {
  foreignKey: "userId",
  sourceKey: "id",
});

Project.belongsTo(User, {
  foreignKey: "userId",
  targetKey: "id",
});

//Relacion Usuario-Seccion

User.hasMany(Section, {
    foreignKey: "userId",
    sourceKey: "id",
});

Section.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "id",
});

export { Section, Entry, Project, Tasks, User };

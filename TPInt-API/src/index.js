import sequelize from "./database/database.js";
import app from "./app.js";
import "./models/index.js";
async function main() {
  try {
    await sequelize.sync({alter: false})
    console.log("La conexión se estableció correctamente.");
    app.listen(4000); //añado el método listen, que por como está definido recibe 1 argumento que es el puerto (3000 en este caso)
    console.log("Servidor ejecutandose en el puerto 4000");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
} 

main();
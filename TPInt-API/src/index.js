// Aca lo primero que hago es inicializar un proyecto de express
// es decir, tengo que iniciar el servidor de express
//por lo tanto creo el archivo app.js en el cual voy
//a guardar la configuracion de express unicamente
// y index va a ser el encargado de arrancar la aplicacion
import sequelize from "./database/database.js";
import app from "./app.js";

async function main() {
  try {
    await sequelize.sync({})
    console.log("La conexión se estableció correctamente.");
    app.listen(4000); //añado el método listen, que por como está definido recibe 1 argumento que es el puerto (3000 en este caso)
    console.log("Servidor ejecutandose en el puerto 4000");
  } catch (error) {
    console.error("Unable to connect to the database", error);
  }
}

main();

//que es esto de function main y qsy
//bueno, paso por paso. 
//Primero creo una funcion asincrona llamada main con un metodo que se llama trycatch
//trycatch es un mecanismo que va a intentar ejecutar primero lo que está dentro de las {} de try
//y si no puede, ejecuta el catch con un mensaje de error.
//dentro del try tenemos un await con el metodo sequelize.authenticate, que authenticate es un metodo
//de testeo que tiene sequelize para probar si la conexion con la bdd se realizó de manera correcta.
//mas adelante voy a cambiar ese authenticate por otra cosa.
//luego inicio la app.js diciendo que la escuche en el puerto 4000 
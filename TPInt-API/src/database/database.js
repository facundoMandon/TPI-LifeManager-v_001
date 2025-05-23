import Sequelize from 'sequelize';
///Sequelize en mayuscula hace referencia a la biblioteca misma.
//sequelize en minuscula hace referencia a una instancia de esa biblioteca.
// sequelize se usa para conectar la base de datos.
//Los parentesis se usan para definir operaciones, agruparlas o llamar funciones)
//las llaves {} se usan para escribir bloques de codigo, objetos o el cuerpo de las funciones

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: "./tpi-db.sqlite",
    //segun la documentacion, cuando creamos una nueva conexion, Sequelize recibe 3 argumentos, "database" "username" "possword" pero
    //si la conexion es con sqlite, no necesitamos nada de eso pues sqlite no usa usuario ni contraseña, sino que usa un archivo en el disco.
    //por eso creo storage: y le indico donde está el archivo de la bdd
})//creo la database con Dbeaver, que me permite conectarme a una base de datos mysql y tener una interfaz gráfica

export default sequelize;
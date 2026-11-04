require("dotenv").config();
const mySql = require("mysql2/promise");

const SQL_CONFIGURATION_DATA =
{
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	charset: 'UTF8_GENERAL_CI'
}
/**
 * Realiza una query a la base de datos MySQL indicada en el archivo "mysql.js".
 * @param {String} queryString Query que se desea realizar. Textual como se utilizaría en el MySQL Workbench.
 * @returns Respuesta de la base de datos. Suele ser un vector de objetos.
 */
exports.realizarQuery = async function (queryString, valores = [])
{
	let returnObject;
	let connection;
	try
	{
		connection = await mySql.createConnection(SQL_CONFIGURATION_DATA);
		returnObject = await connection.execute(queryString, valores);
	}
	catch(err)
	{
		console.log(err);
		throw err;
	}
	finally
	{
		if(connection && connection.end) connection.end();
	}
	return returnObject[0];
}
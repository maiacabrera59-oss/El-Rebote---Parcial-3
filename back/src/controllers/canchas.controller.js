const sql = require("mssql");
const { getConnection } = require("../config/db");

// GET /api/canchas
const obtenerCanchas = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .execute("usp_ListarCanchas");

        res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener canchas:", error);

        res.status(500).json({
            mensaje: "Error al obtener las canchas",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCanchas,

};
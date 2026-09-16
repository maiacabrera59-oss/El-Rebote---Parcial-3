const { getConnection } = require("../config/db");

// GET /api/reportes/recaudacion
const obtenerRecaudacion = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .execute("dbo.usp_RecaudacionPorCancha");

        return res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener el reporte de recaudación:", error);

        return res.status(500).json({
            mensaje: "Error interno al generar el reporte de recaudación.",
            error: error.message
        });
    }
};

module.exports = {
    obtenerRecaudacion
};
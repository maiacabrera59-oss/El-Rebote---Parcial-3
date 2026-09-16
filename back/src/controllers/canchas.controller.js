const { getConnection } = require("../config/db");

const obtenerCanchas = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .execute("usp_ListarCanchas");

        const canchas = result.recordset.map(cancha => ({
            idCancha: cancha.idcancha,
            nombre: cancha.nombre,
            precioPorHora: cancha.precioporhora
        }));

        res.status(200).json(canchas);

    } catch (error) {
        console.error("Error al obtener canchas:", error);

        res.status(500).json({
            mensaje: "Error al obtener las canchas",
            error: error.message
        });
    }
};

module.exports = {
    obtenerCanchas
};
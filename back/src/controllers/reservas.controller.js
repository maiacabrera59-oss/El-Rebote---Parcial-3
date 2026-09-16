const sql = require("mssql");
const { getConnection } = require("../config/db");

// GET /api/reservas
const listarReservas = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .execute("dbo.usp_ListarReservas");

        return res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener reservas:", error);

        return res.status(500).json({
            mensaje: "Error interno al listar las reservas.",
            error: error.message
        });
    }
};

// GET /api/reservas/recaudacion
const listarRecaudacionPorCancha = async (req, res) => {
    try {
        const pool = await getConnection();

        const result = await pool
            .request()
            .execute("dbo.usp_RecaudacionPorCancha");

        return res.status(200).json(result.recordset);

    } catch (error) {
        console.error("Error al obtener recaudación por cancha:", error);

        return res.status(500).json({
            mensaje: "Error interno al consultar la recaudación.",
            error: error.message
        });
    }
};

// POST /api/reservas
const crearReserva = async (req, res) => {
    try {
        const { IdCancha, Cliente, Fecha, Hora } = req.body;

        if (!Number.isInteger(Number(IdCancha))) {
            return res.status(400).json({
                mensaje: "El IdCancha debe ser un número entero."
            });
        }

        if (!Cliente || typeof Cliente !== "string" || Cliente.trim() === "") {
            return res.status(400).json({
                mensaje: "Debe indicar el nombre del cliente."
            });
        }

        if (!Fecha || !Hora) {
            return res.status(400).json({
                mensaje: "Debe proporcionar una fecha y hora válidas."
            });
        }

        const pool = await getConnection();

        const result = await pool
            .request()
            .input("IdCancha", sql.Int, Number(IdCancha))
            .input("Cliente", sql.NVarChar(100), Cliente.trim())
            .input("Fecha", sql.Date, Fecha)
            .input("Hora", sql.NVarChar(5), Hora)
            .execute("dbo.usp_CrearReserva");

        const resultado = result.recordset[0];

        return res.status(201).json({
            mensaje: "Reserva creada con éxito.",
            idReserva: resultado?.IdReserva || resultado?.idReserva
        });

    } catch (error) {
        console.error("Error al crear la reserva:", error);

        if (error.number === 50002) {
            return res.status(404).json({
                mensaje: error.message
            });
        }

        if (error.number === 50003 || error.number === 50011) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        return res.status(500).json({
            mensaje: "Error interno al registrar la reserva.",
            error: error.message
        });
    }
};

// PUT /api/reservas/:id/pago
const registrarPago = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Number.isInteger(Number(id))) {
            return res.status(400).json({
                mensaje: "El IdReserva debe ser un número entero."
            });
        }

        const pool = await getConnection();

        const result = await pool
            .request()
            .input("IdReserva", sql.Int, Number(id))
            .execute("dbo.usp_RegistrarPago");

        const resultado = result.recordset[0];

        return res.status(200).json({
            mensaje: resultado?.Mensaje || "Pago registrado con éxito.",
            idReserva: resultado?.IdReserva || Number(id)
        });

    } catch (error) {
        console.error("Error al registrar pago de reserva:", error);

        if (error.number === 50002) {
            return res.status(404).json({
                mensaje: error.message
            });
        }

        if (error.number === 50008) {
            return res.status(400).json({
                mensaje: error.message
            });
        }

        return res.status(500).json({
            mensaje: "Error interno al registrar el pago.",
            error: error.message
        });
    }
};

module.exports = {
    listarReservas,
    listarRecaudacionPorCancha,
    crearReserva,
    registrarPago
};
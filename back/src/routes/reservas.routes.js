const express = require("express");
const router = express.Router();

const {
    listarReservas,
    crearReserva,
    registrarPago
} = require("../controllers/reservas.controller");

// GET /api/reservas 
router.get("/", listarReservas);


// POST /api/reservas 
router.post("/", crearReserva);

// PUT /api/reservas/:id/pago
router.put("/:id/pago", registrarPago);

module.exports = router;
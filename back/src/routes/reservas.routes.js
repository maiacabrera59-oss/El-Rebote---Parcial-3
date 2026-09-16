const express = require("express");
const router = express.Router();

const {
    listarReservas,
    listarRecaudacionPorCancha,
    crearReserva,
    registrarPago
} = require("../controllers/reservas.controller");

// GET /api/reservas 
router.get("/", listarReservas);

// GET /api/reservas/recaudacion 
router.get("/recaudacion", listarRecaudacionPorCancha);

// POST /api/reservas 
router.post("/", crearReserva);

// PUT /api/reservas/:id/pago
router.put("/:id/pago", registrarPago);

module.exports = router;
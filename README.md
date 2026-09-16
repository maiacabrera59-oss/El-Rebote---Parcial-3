1- La regla de no reservar una cancha que ya está ocupada se controla de dos formas.
 El USP verifica que no exista otra reserva para esa misma cancha, fecha y horario antes de registrar una nueva.
  La restricción de la tabla sirve como una segunda protección a nivel de la base de datos, para evitar que se guarde un dato que viole esa regla.

2- Cambios de diseño: agregaría una tabla Clientes y en Reservas agregaría IdCliente como clave foránea. Así cada reserva queda asociada a un cliente y puedo consultar todas sus reservas para mostrar su historial. La relación sería uno a muchos (1:N), porque un cliente puede tener muchas reservas, pero cada reserva pertenece a un solo cliente.
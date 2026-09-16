
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const canchasRoutes = require('./routes/canchas.routes');
const reservasRoutes = require('./routes/reservas.routes');
const reportesRoutes = require('./routes/reportes.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/api/canchas', canchasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/reportes', reportesRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
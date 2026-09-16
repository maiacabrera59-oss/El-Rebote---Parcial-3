
require('dotenv').config();
const express = require('express');
const cors = require('cors');


const canchasRoutes = require('./routes/canchas.routes');


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


app.use('/api/canchas', canchasRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
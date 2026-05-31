require('dotenv').config();


const express = require('express');
const cors = require('cors');
const path = require('path');



const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/documents', require('./routes/documents'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 LifeArchive lancé sur le port ${PORT}`);
});
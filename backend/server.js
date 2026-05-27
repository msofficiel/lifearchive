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


app.listen(3000, () => {
    console.log("🚀 LifeArchive lancé sur http://localhost:3000");
});
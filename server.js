import 'dotenv/config';
import db from './config/database.js'
import express from 'express';
import indexRoutes from './routes/indexRoutes.js'

const app = express();
app.use(express.json());

const port = process.env.PORT;

async function inicio() {
    try {
        await db.execute('SELECT 1');
        console.log('Conectado ao MySQL com sucesso');

        app.listen(port, () => {
            console.log(`Servidor sendo executado em http://localhost:${port}`);
        });
    }

    catch (err) {
        console.error('Falha ao conectar no banco de dados:', err.message);
        process.exit(1);
    }
}

// [DEBUG]
inicio();

app.get('/', (req, res) => {
    res.json({ message: 'Jitterbit Order API está online.' });
});

// ROTAS
app.use('/', indexRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada.' });
});
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;
const db = new sqlite3.Database(':memory:');

// Configuração inicial do banco
db.serialize(() => {
    db.run(`
        CREATE TABLE awards (
            id INTEGER PRIMARY KEY,
            title TEXT,
            year INTEGER,
            producer TEXT,
            winner BOOLEAN
        )
    `);
});

// Função para carregar o CSV e popular o banco de dados
function loadCSV() {
    const data = [];
    fs.createReadStream('movielist.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            const insertStmt = db.prepare(`INSERT INTO awards (title, year, producer, winner) VALUES (?, ?, ?, ?)`);
            data.forEach(row => {
                const isWinner = row.winner && row.winner.trim().toLowerCase() === 'yes' ? 1 : 0;

                // Dividir produtores por ',' ou 'and' e salvar como strings separadas
                const producers = row.producers.split(/,|and/).map(p => p.trim());

                producers.forEach(producer => {
                    insertStmt.run(row.title, parseInt(row.year), producer, isWinner);
                });
            });
            insertStmt.finalize();
            console.log('CSV data loaded into the database');
        });
}
loadCSV();

// Endpoint para obter os intervalos gerais (mínimos e máximos)
app.get('/awards/intervals', (req, res) => {
    db.all(`SELECT producer, year FROM awards WHERE winner = 1 ORDER BY producer, year`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const producerWins = {};
        rows.forEach(row => {
            if (!producerWins[row.producer]) {
                producerWins[row.producer] = [];
            }
            producerWins[row.producer].push(row.year);
        });

        const intervals = [];
        for (const producer in producerWins) {
            const wins = producerWins[producer];
            for (let i = 1; i < wins.length; i++) {
                intervals.push({
                    producer,
                    interval: wins[i] - wins[i - 1],
                    previousWin: wins[i - 1],
                    followingWin: wins[i]
                });
            }
        }

        // Encontrar o intervalo geral mínimo e máximo
        const overallMinInterval = Math.min(...intervals.map(i => i.interval));
        const overallMaxInterval = Math.max(...intervals.map(i => i.interval));

        const result = {
            min: intervals.filter(i => i.interval === overallMinInterval),
            max: intervals.filter(i => i.interval === overallMaxInterval)
        };

        // Adicionar uma validação para o resultado
        if (result.min.length === 0 || result.max.length === 0) {
            res.status(404).json({ error: 'Nenhum intervalo encontrado' });
            return;
        }

        res.json(result);
    });
});

// Endpoint para obter todos os filmes do banco de dados
app.get('/awards/movies', (req, res) => {
    db.all(`SELECT * FROM awards`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        // Retornar todos os registros no banco de dados
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, db };
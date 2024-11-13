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
                const isWinner = row.winner === 'yes' ? 1 : 0;
                insertStmt.run(row.title, parseInt(row.year), row.producers, isWinner);
            });
            insertStmt.finalize();
            console.log('CSV data loaded into the database');
        });
}
loadCSV();

// Endpoint para obter os produtores com maiores e menores intervalos entre prêmios
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

        const maxInterval = Math.max(...intervals.map(i => i.interval));
        const minInterval = Math.min(...intervals.map(i => i.interval));

        const result = {
            min: intervals.filter(i => i.interval === minInterval),
            max: intervals.filter(i => i.interval === maxInterval)
        };

        res.json(result);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = { app, db };
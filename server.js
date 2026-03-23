const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

// Konfigurasi Database Lokal
const db = mysql.createConnection({
    // host: "34.122.244.37", 
    socketPath: "/cloudsql/project-tcc06:us-central1:notes-db-exydous", 
    user: "Exydous",
    password: "Benedictus28*", 
    database: "notes_db",
    ssl: {
        rejectUnauthorized: false 
    }
});

db.connect(err => {
    if(err) throw err;
    console.log('Database terhubung!');
});

// 1. TAMBAH Catatan
app.post('/api/notes', (req, res) => {
    const { judul, isi } = req.body;
    db.query('INSERT INTO notes (judul, isi) VALUES (?, ?)', [judul, isi], (err, result) => {
        if(err) return res.status(500).send(err);
        res.status(201).send({ message: 'Catatan ditambahkan!', id: result.insertId });
    });
});

// 2. LIHAT Daftar Catatan
app.get('/api/notes', (req, res) => {
    db.query('SELECT * FROM notes ORDER BY tanggal_dibuat DESC', (err, results) => {
        if(err) return res.status(500).send(err);
        res.json(results);
    });
});

// --- FITUR EDIT (UPDATE) ---
app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id; // Mengambil ID dari URL
    const { judul, isi } = req.body; // Mengambil data baru dari body request

    const query = "UPDATE notes SET judul = ?, isi = ? WHERE id = ?";
    
    db.query(query, [judul, isi, id], (err, results) => {
        if (err) {
            console.error("Error saat mengedit:", err);
            return res.status(500).json({ error: "Gagal mengedit catatan di database" });
        }
        
        // Jika ID tidak ditemukan di database
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Catatan tidak ditemukan!" });
        }
        
        res.json({ message: "✅ Catatan berhasil diperbarui!" });
    });
});

// --- FITUR HAPUS (DELETE) ---
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id; // Mengambil ID dari URL

    const query = "DELETE FROM notes WHERE id = ?";
    
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error saat menghapus:", err);
            return res.status(500).json({ error: "Gagal menghapus catatan" });
        }
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Catatan tidak ditemukan!" });
        }
        
        res.json({ message: "🗑️ Catatan berhasil dihapus!" });
    });
});

// Konfigurasi Port Dinamis untuk Cloud
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
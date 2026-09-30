	require('dotenv').config(); // load .env
  const express = require('express');
  const cors = require('cors');
	const app = express();
	const PORT = process.env.PORT || 3000;
	
  // Middleware custom
  //logger : untuk me ncatat setiap request yang masuk
  function logger(req, res, next) {
  const waktu = new Date().toISOString();
  console.log(`[${waktu}] ${req.method} ${req.url}`);
  next(); // wajib, agar request lanjut ke handler berikutnya
}

  // Didaftarkan sebelum route agar mencatat seluruh request
  app.use(logger);
  app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
//middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

	app.get('/', (req, res) => {
	  res.send('Server Express.js berjalan!');
	});

	app.get('/profile', (req, res) => {
	  res.send('ini halaman profile!');
	});

	app.listen(PORT, () => {
	  console.log(`Server berjalan di http://localhost:${PORT}`);
	});

    // Middleware agar req.body (JSON) dapat dibaca
app.use(express.json());

// Data sementara (disimpan di memori, hilang saat server restart)
let mahasiswa = [
  { id: 1, nama: 'Andi', jurusan: 'Sistem Informasi' },
  { id: 2, nama: 'Budi', jurusan: 'Informatika' },
];
let nextId = 3; // penghitung id untuk data baru

// GET /mahasiswa -> menampilkan seluruh data
// GET /mahasiswa?jurusan=sistem informasi
app.get('/mahasiswa', (req, res) => {
	const {jurusan} = req.query;
	
	if (jurusan) {
		const hasil = mahasiswa.filter((m) => m.jurusan === jurusan);
		return res.json(hasil);
	}
  res.json(mahasiswa);
});

// GET /mahasiswa/:id -> menampilkan satu data berdasarkan id
app.get('/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const data = mahasiswa.find((m) => m.id === id);

  if (!data) return res.status(404).json({ message: 'Data tidak ditemukan' });
  res.json(data);
}); 

// POST /mahasiswa
// Body: { "nama": "Citra", "jurusan": "Sistem Informasi" }
app.post('/mahasiswa', (req, res) => {
  const { nama, jurusan } = req.body;

  if (!nama || !jurusan) {
    return res.status(400).json({ message: 'nama dan jurusan wajib diisi' });
  }

  const baru = { id: nextId++, nama, jurusan };

  mahasiswa.push(baru); //simpan dalam array
  res.status(201).json(baru); //respon json
});

// PUT /mahasiswa/2
// Body: { "nama": "Budi Santoso", "jurusan": "Informatika" }
app.put('/mahasiswa/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = mahasiswa.findIndex((m) => m.id === id); //Mencari index array

  if (index === -1) {
    return res.status(404).json({ message: 'Data tidak ditemukan' }); 
  }

  mahasiswa[index] = { ...mahasiswa[index], ...req.body, id }; //Proses update data
  res.json(mahasiswa[index]);
});
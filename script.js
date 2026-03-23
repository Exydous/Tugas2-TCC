const API_URL = 'https://project-tcc06.uc.r.appspot.com/api/notes';


const form = document.getElementById('form-catatan');
const inputId = document.getElementById('note-id');
const inputJudul = document.getElementById('judul');
const inputIsi = document.getElementById('isi');
const daftarCatatan = document.getElementById('daftar-catatan');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');

// 1. Fitur BACA (GET) - Mengambil data dari Cloud
async function tampilkanCatatan() {
    try {
        const response = await fetch(API_URL);
        const notes = await response.json();
        
        daftarCatatan.innerHTML = '';
        
        notes.forEach(note => {
            const div = document.createElement('div');
            div.className = 'note-card'; 
            div.innerHTML = `
                <h3>${note.judul}</h3>
                <p>${note.isi}</p>
                <div class="actions">
                    <button onclick="siapkanEdit('${note.id}', '${note.judul}', '${note.isi}')">✏️ Edit</button>
                    <button onclick="hapusCatatan('${note.id}')">🗑️ Hapus</button>
                </div>
                <hr>
            `;
            daftarCatatan.appendChild(div);
        });
    } catch (error) {
        console.error('Gagal mengambil data:', error);
    }
}

// 2. Fitur TAMBAH (POST) dan UPDATE (PUT)
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Mencegah halaman reload
    
    const id = inputId.value;
    const judul = inputJudul.value;
    const isi = inputIsi.value;
    
    
    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ judul, isi })
        });
        
        resetForm();
        tampilkanCatatan();
    } catch (error) {
        console.error('Gagal menyimpan data:', error);
    }
});

// 3. Fitur HAPUS (DELETE)
async function hapusCatatan(id) {
    if (confirm('Yakin ingin menghapus catatan ini?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            tampilkanCatatan(); 
        } catch (error) {
            console.error('Gagal menghapus data:', error);
        }
    }
}

// 4. Fitur Persiapan Edit (Memasukkan data ke form)
function siapkanEdit(id, judul, isi) {
    inputId.value = id;
    inputJudul.value = judul;
    inputIsi.value = isi;
    
    btnSubmit.innerText = '💾 Update Catatan'; 
    btnCancel.style.display = 'inline-block'; 
    window.scrollTo(0, 0); 
}

// Fungsi pembantu untuk mereset formulir
function resetForm() {
    inputId.value = '';
    inputJudul.value = '';
    inputIsi.value = '';
    btnSubmit.innerText = 'Tambah Catatan';
    btnCancel.style.display = 'none';
}

// Tombol Batal Edit
btnCancel.addEventListener('click', resetForm);

// Panggil fungsi tampilkanCatatan saat website pertama kali dibuka
tampilkanCatatan();

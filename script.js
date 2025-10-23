const saldoEl = document.getElementById('saldo');
const totalPemasukanEl = document.getElementById('total-pemasukan');
const totalPengeluaranEl = document.getElementById('total-pengeluaran');
const formTransaksi = document.getElementById('form-transaksi');
const daftarTransaksiEl = document.getElementById('daftar-transaksi');
const deskripsiInput = document.getElementById('deskripsi');
const jumlahInput = document.getElementById('jumlah');
const tipeInput = document.getElementById('tipe');

let transaksi = JSON.parse(localStorage.getItem('transaksi')) || [];

function perbaruiRingkasan() {
    const jumlahTransaksi = transaksi.map(trans => trans.jumlah);

    const totalPemasukan = jumlahTransaksi
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0);

    const totalPengeluaran = jumlahTransaksi
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0);

    const saldo = totalPemasukan + totalPengeluaran;

    saldoEl.innerText = formatUang(saldo);
    totalPemasukanEl.innerText = formatUang(totalPemasukan);
    totalPengeluaranEl.innerText = formatUang(totalPengeluaran);
}

function tambahkanTransaksiKeDOM(trans) {
    const tanda = trans.jumlah < 0 ? '-' : '+';
    const item = document.createElement('li');

    item.classList.add(trans.jumlah < 0 ? 'pengeluaran' : 'pemasukan');

    item.innerHTML = `
        ${trans.deskripsi} <span>${tanda}${formatUang(Math.abs(trans.jumlah))}</span>
        <button class="delete-btn" onclick="hapusTransaksi(${trans.id})">x</button>
    `;

    daftarTransaksiEl.appendChild(item);
}

function tambahTransaksi(e) {
    e.preventDefault();

    if (deskripsiInput.value.trim() === '' || jumlahInput.value.trim() === '') {
        alert('Mohon isi semua kolom!');
        return;
    }

    const jumlah = tipeInput.value === 'pemasukan' ? +jumlahInput.value : -+jumlahInput.value;

    const trans = {
        id: generateID(),
        deskripsi: deskripsiInput.value,
        jumlah: jumlah
    };

    transaksi.push(trans);
    tambahkanTransaksiKeDOM(trans);
    perbaruiLocalStorage();
    perbaruiRingkasan();

    deskripsiInput.value = '';
    jumlahInput.value = '';
}

function hapusTransaksi(id) {
    transaksi = transaksi.filter(trans => trans.id !== id);
    perbaruiLocalStorage();
    inisialisasi();
}

function perbaruiLocalStorage() {
    localStorage.setItem('transaksi', JSON.stringify(transaksi));
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function formatUang(jumlah) {
    return `Rp ${Math.abs(jumlah).toLocaleString('id-ID')}`;
}

function inisialisasi() {
    daftarTransaksiEl.innerHTML = '';
    transaksi.forEach(tambahkanTransaksiKeDOM);
    perbaruiRingkasan();
}

formTransaksi.addEventListener('submit', tambahTransaksi);

inisialisasi();

// utils/calculationHelper.js

/**
 * Menghitung nilai rata-rata dari empat mata pelajaran.
 * @param {object} nilai - Objek yang berisi nilai_bindonesia, nilai_imla, nilai_alquran, nilai_berhitung.
 * @returns {number | null} Rata-rata nilai, dibulatkan 2 angka di belakang koma, atau null jika ada nilai yang hilang.
 */
function calculateAverage(nilai) {
    const { nilai_bindonesia, nilai_imla, nilai_alquran, nilai_berhitung } = nilai;

    // Pastikan semua nilai telah terinput
    if (nilai_bindonesia === null || nilai_imla === null || nilai_alquran === null || nilai_berhitung === null) {
        return null;
    }

    const sum = parseFloat(nilai_bindonesia) + parseFloat(nilai_imla) + parseFloat(nilai_alquran) + parseFloat(nilai_berhitung);
    const average = sum / 4;

    // Bulatkan ke 2 desimal
    return parseFloat(average.toFixed(2));
}

module.exports = { calculateAverage };
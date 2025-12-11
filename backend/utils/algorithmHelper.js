// utils/algorithmHelper.js

/**
 * Menerapkan Algoritma Pemerataan Round-Robin/Zig-Zag berdasarkan rata-rata nilai.
 *
 * @param {Array<object>} sortedSantri - Daftar santri yang sudah diurutkan (rata-rata tertinggi ke terendah).
 * @param {Array<object>} availableKampus - Daftar kampus yang tersedia (Putra/Putri).
 * @returns {Array<object>} Array hasil penempatan siap insert ke DB.
 */
function runRoundRobinPlacement(sortedSantri, availableKampus) {
    const placementResults = [];
    const kampusMap = {}; // Map untuk menyimpan state kuota_terisi saat ini
    const activeKampus = [];

    // 1. Inisialisasi status kuota dan filter kampus aktif
    for (const kampus of availableKampus) {
        if (kampus.status_aktif && kampus.kuota_terisi < kampus.kuota_pelajar_baru) {
            activeKampus.push(kampus);
            // Gunakan kuota_pelajar_baru sebagai batas penempatan untuk santri baru
            kampusMap[kampus.id_kampus] = {
                id: kampus.id_kampus,
                kuotaSisa: kampus.kuota_pelajar_baru - kampus.kuota_terisi,
            };
        }
    }

    if (activeKampus.length === 0) {
        throw new Error("Tidak ada kampus aktif dengan kuota tersedia.");
    }
    
    let kampusIndex = 0;
    
    // 2. Terapkan Logika Round-Robin/Zig-Zag
    for (const santri of sortedSantri) {
        // Cari kampus berikutnya yang masih memiliki kuota
        let assigned = false;
        let startPoint = kampusIndex;
        
        do {
            const currentKampus = activeKampus[kampusIndex];
            const kampusState = kampusMap[currentKampus.id_kampus];

            if (kampusState && kampusState.kuotaSisa > 0) {
                // Santri ditempatkan!
                placementResults.push({
                    id_santri: santri.id_santri,
                    id_kampus_tujuan: currentKampus.id_kampus,
                });

                // Kurangi kuota
                kampusState.kuotaSisa--;
                assigned = true;
            }

            // Pindah ke kampus berikutnya untuk santri selanjutnya (Round Robin)
            kampusIndex = (kampusIndex + 1) % activeKampus.length;
            
            // Loop break condition jika sudah kembali ke start point dan belum ter-assign
            if (kampusIndex === startPoint && !assigned) break; 

        } while (!assigned); // Lanjut mencari jika belum ter-assign

        // Jika santri tidak bisa di-assign (kuota semua kampus penuh)
        if (!assigned) {
             console.warn(`Santri ${santri.no_pendaftaran} tidak dapat ditempatkan (Kuota Penuh).`);
             // Kita bisa skip santri ini atau buatkan status 'Menunggu'
        }
    }

    return placementResults;
}

module.exports = { runRoundRobinPlacement };
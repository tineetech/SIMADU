/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.seed = async (knex) => {
  await knex('notifikasi').del();

  const userApiUrl = 'https://simaduuser.vercel.app/api/users/';
  const laporanApiUrl = 'https://simadulaporan.vercel.app/api/lapor';
  const numNotifikasiPerUser = 1; // Jumlah notifikasi per user yang laporannya sukses

  let users = [];
  try {
    const responseUser = await fetch(userApiUrl);
    users = await responseUser.json();
    console.log(`${users.data.length} users fetched from API for notifikasi.`);
  } catch (error) {
    console.error('Failed to fetch users from API for notifikasi:', error);
    return;
  }

  let laporans = [];
  try {
    const responseLaporan = await fetch(laporanApiUrl);
    laporans = await responseLaporan.json();
    console.log(`${laporans.length} laporans fetched from API.`);
  } catch (error) {
    console.error('Failed to fetch laporans from API:', error);
    return;
  }

  const notifikasiData = [];
  for (const user of users.data) {
    const successLaporansByUser = laporans.data.filter(
      (laporan) => laporan.user_id === user.user_id && laporan.status === 'success'
    );

    if (successLaporansByUser.length > 0) {
      // Buat notifikasi untuk laporan sukses user ini
      for (let i = 0; i < Math.min(numNotifikasiPerUser, successLaporansByUser.length); i++) {
        const laporan = successLaporansByUser[i];
        const randomDate = faker.date.recent();
        const title = `Laporan #${laporan.id} telah diverifikasi`;
        const message = `Laporan Anda dengan ID #${laporan.id} telah berhasil diverifikasi oleh tim kami. Terima kasih atas partisipasi Anda!`;

        notifikasiData.push({
          user_id: user.user_id,
          laporan_id: laporan.id,
          title: title,
          message: message,
          is_read: 0,
          created_at: randomDate,
          updated_at: randomDate,
        });
      }
    }
  }

  try {
    await knex('notifikasi').insert(notifikasiData);
    console.log(`${notifikasiData.length} notifikasi data added.`);
  } catch (error) {
    console.error('Error adding notifikasi data:', error);
  }
};
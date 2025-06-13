/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.seed = async (knex) => {
  await knex('postingan').del();

  const userApiUrl = 'https://simaduuser.vercel.app/api/users/';
  const numPosting = 350; // Jumlah postingan yang ingin dibuat
  const kesehatanTextId = [
    'Jagalah kebersihan lingkungan untuk mencegah penyebaran penyakit.',
    'Buang sampah pada tempatnya agar lingkungan tetap sehat dan nyaman.',
    'Konsumsi makanan bergizi dan olahraga teratur untuk menjaga kesehatan tubuh.',
    'Polusi udara dapat membahayakan kesehatan pernapasan. Mari kurangi penggunaan kendaraan pribadi.',
    'Air bersih adalah kebutuhan pokok. Lindungi sumber air dari pencemaran.',
    'Menanam pohon membantu menciptakan udara yang lebih segar dan sehat.',
    'Kurangi penggunaan plastik untuk menjaga kesehatan ekosistem laut dan darat.',
    'Pentingnya vaksinasi untuk mencegah penyakit menular di masyarakat.',
    'Perilaku hidup bersih dan sehat (PHBS) harus diterapkan sejak dini.',
    'Mari bersama-sama menjaga lingkungan sekolah agar tetap bersih dan kondusif untuk belajar.',
    'Kualitas tidur yang cukup sangat penting untuk kesehatan fisik dan mental.',
    'Rutin memeriksakan kesehatan ke dokter adalah langkah pencegahan yang baik.',
    'Stress yang tidak terkontrol dapat berdampak buruk pada kesehatan mental. Cari cara untuk mengelolanya.',
    'Lingkungan yang hijau dan asri dapat meningkatkan kesehatan mental dan mengurangi stress.',
    'Edukasi tentang kesehatan lingkungan perlu ditingkatkan di semua lapisan masyarakat.',
  ];

  let userIds = [];
  try {
    const response = await fetch(userApiUrl);
    const users = await response.json();
    userIds = users.data.map(user => user.user_id);
    console.log(`${userIds.length} user IDs fetched from API for postingan.`);
  } catch (error) {
    console.error('Failed to fetch user IDs for postingan from API:', error);
    return;
  }

  const postinganData = [];
  for (let i = 0; i < numPosting; i++) {
    const randomUserIdIndex = Math.floor(Math.random() * userIds.length);
    const randomTextIndex = Math.floor(Math.random() * kesehatanTextId.length);
    const randomDate = faker.date.recent();

    postinganData.push({
      user_id: userIds[randomUserIdIndex],
      type: 'text',
      content: kesehatanTextId[randomTextIndex],
      status: 'active',
      created_at: randomDate,
      updated_at: randomDate,
    });
  }

  try {
    await knex('postingan').insert(postinganData);
    console.log(`${postinganData.length} postingan data added.`);
  } catch (error) {
    console.error('Error adding postingan data:', error);
  }
};
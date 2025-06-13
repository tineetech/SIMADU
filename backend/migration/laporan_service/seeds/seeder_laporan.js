/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.seed = async (knex) => {
  await knex('laporan').del();

  const userApiUrl = 'https://simaduuser.vercel.app/api/users/';
  const imageUrls = [
    'https://vuu8scq0xwq6upti.public.blob.vercel-storage.com/10-km-jalan-kali-cbl-rusak-parah-dan-bahayakan-pengendara-abrxJI610ztsHlAR2w6wfZJwiHY0R3.jpeg',
    'https://vuu8scq0xwq6upti.public.blob.vercel-storage.com/banjir-di-rawajati-pancoran-jaksel-4-maret-2025-taufiq-syarifudindetikcom-1741060131774_169-nWQDgspH8UwGiz0OXUqcLVrgdFD2xI.jpeg',
    'https://vuu8scq0xwq6upti.public.blob.vercel-storage.com/jalan%20rusak-0QPfYvDoXQQuTUWLsIxRni32qFfBZ7.jpeg',
  ];
  const categories = ['jalan_rusak', 'banjir', 'sampah_menumpuk'];
  const statuses = ['pending', 'proses', 'success'];
  const numLaporan = 200; // Jumlah laporan yan2 ingin dibuat

  let userIds = [];
  try {
    const response = await fetch(userApiUrl);
    const users = await response.json();
    // console.log(users)
    userIds = users.data.map(user => user.user_id);
    console.log(`${userIds.length} user IDs fetched from API.`);
  } catch (error) {
    console.error('Failed to fetch user IDs from API:', error);
    return;
  }

  const laporanData = [];
  for (let i = 0; i < numLaporan; i++) {
    const randomUserIdIndex = Math.floor(Math.random() * userIds.length);
    const randomLatitude = faker.location.latitude({ min: -6.65, max: -6.50, precision: 6 }); // Latitude sekitar Bogor
    const randomLongitude = faker.location.longitude({ min: 106.75, max: 106.85, precision: 6 }); // Longitude sekitar Bogor
    const randomDate = faker.date.between({ from: '2025-01-01', to: new Date() }); // Gunakan objek konfigurasi
    const randomCategory = faker.helpers.arrayElement(categories);
    const randomStatus = faker.helpers.arrayElement(statuses);
    const randomImage = faker.helpers.arrayElement(imageUrls);

    laporanData.push({
      user_id: userIds[randomUserIdIndex],
      image: randomImage,
      location_latitude: randomLatitude,
      location_longitude: randomLongitude,
      description: "",
      event_date: randomDate,
      category: randomCategory,
      type_verification: faker.helpers.arrayElement(['automatic', 'manual']),
      status: randomStatus,
      notes: null,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  try {
    await knex('laporan').insert(laporanData);
    console.log(`${laporanData.length} laporan data added.`);
  } catch (error) {
    console.error('Error adding laporan data:', error);
  }
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

exports.seed = async (knex) => {
  await knex('transaction_koin').del();
  await knex('koin').del();
  await knex('users').del();

  const avatarUrls = [
    'https://i.pravatar.cc/150?img=1',
    'https://i.pravatar.cc/150?img=2',
    'https://i.pravatar.cc/150?img=3',
    'https://i.pravatar.cc/150?img=4',
    'https://i.pravatar.cc/150?img=5',
    'https://i.pravatar.cc/150?img=6',
    'https://i.pravatar.cc/150?img=7',
    'https://i.pravatar.cc/150?img=8',
    'https://i.pravatar.cc/150?img=9',
    'https://i.pravatar.cc/150?img=10',
  ];

  const usersData = Array.from({ length: 100 }, () => {
    const firstName = faker.person.firstName().toLowerCase().replace(/[^a-z]/g, '');
    const lastName = faker.person.lastName().toLowerCase().replace(/[^a-z]/g, '');
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const email = `${firstName}_${lastName}@gmail.com`;
    const role = 'guest';
    const plainPassword = 'password123';
    const saltRounds = 10;
    const randomAvatarUrl = faker.helpers.arrayElement(avatarUrls);

    return bcrypt.hash(plainPassword, saltRounds)
      .then(hashedPassword => ({
        username: username,
        first_name: firstName,
        avatar: randomAvatarUrl,
        last_name: lastName,
        email: email,
        role: role,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      }));
  });

  let insertedUserIds = [];
  try {
    const resolvedUsers = await Promise.all(usersData);
    await knex('users').insert(resolvedUsers);
    insertedUserIds = await knex('users').select('user_id').orderBy('created_at', 'desc').limit(100);
    console.log(`${insertedUserIds.length} users berhasil ditambahkan.`);
    console.log('insertedUserIds:', insertedUserIds);
  } catch (error) {
    console.error('Error saat menambahkan users:', error);
    return;
  }

  // Tambahkan akun lain setelah loop seeder users
  // admin account
  const randomAvatarUrl1 = faker.helpers.arrayElement(avatarUrls);
  const adminPasswordPlain = 'adminsk123';
  const adminSaltRounds = 10;
  const adminPasswordHashed = await bcrypt.hash(adminPasswordPlain, adminSaltRounds);
  const randomAdminAvatarUrl = faker.helpers.arrayElement(avatarUrls);
  const [adminUserId] = await knex('users').insert({
    username: 'admin',
    first_name: 'SuperAdmin',
    last_name: 'simadu',
    avatar: randomAvatarUrl1,
    email: 'adminsk@gmail.com',
    role: 'admin',
    password: adminPasswordHashed,
    avatar: randomAdminAvatarUrl,
    created_at: new Date(),
    updated_at: new Date(),
  });
  console.log(`Akun admin dengan username 'admin' dan ID ${adminUserId} berhasil ditambahkan.`);

  // justine account
  const randomAvatarUrl2 = faker.helpers.arrayElement(avatarUrls);
  const justinPasswordPlain = 'pass123';
  const justinSaltRounds = 10;
  const justinPasswordHashed = await bcrypt.hash(justinPasswordPlain, justinSaltRounds);
  const randomJustinAvatarUrl = faker.helpers.arrayElement(avatarUrls);
  const [justineUserId] = await knex('users').insert({
    username: 'justine',
    first_name: 'justine',
    avatar: randomAvatarUrl2,
    last_name: 'ganteng',
    email: 'justinebogor0609@gmail.com',
    role: 'admin',
    password: justinPasswordHashed,
    avatar: randomJustinAvatarUrl,
    created_at: new Date(),
    updated_at: new Date(),
  });
  console.log(`Akun justine dengan username 'justine' dan ID ${justineUserId} berhasil ditambahkan.`);

  // renjie account
  const randomAvatarUrl3 = faker.helpers.arrayElement(avatarUrls);
  const renjiePasswordPlain = 'pass123';
  const renjieSaltRounds = 10;
  const renjiePasswordHashed = await bcrypt.hash(renjiePasswordPlain, renjieSaltRounds);
  const randomRenjieAvatarUrl = faker.helpers.arrayElement(avatarUrls);
  const [renjieUserId] = await knex('users').insert({
    username: 'renjie',
    first_name: 'renjie',
    last_name: 'ganteng',
    avatar: randomAvatarUrl3,
    email: 'renjieajalah@gmail.com',
    role: 'admin',
    password: renjiePasswordHashed,
    avatar: randomRenjieAvatarUrl,
    created_at: new Date(),
    updated_at: new Date(),
  });
  console.log(`Akun renjie dengan username 'renjie' dan ID ${renjieUserId} berhasil ditambahkan.`);

  // heidar account
  const randomAvatarUrl4 = faker.helpers.arrayElement(avatarUrls);
  const heidarPasswordPlain = 'pass123';
  const heidarSaltRounds = 10;
  const heidarPasswordHashed = await bcrypt.hash(heidarPasswordPlain, heidarSaltRounds);
  const randomHeidarAvatarUrl = faker.helpers.arrayElement(avatarUrls);
  const [heidarUserId] = await knex('users').insert({
    username: 'heidar',
    first_name: 'heidar',
    last_name: 'ganteng',
    avatar: randomAvatarUrl4,
    email: 'heidarajalah@gmail.com',
    role: 'admin',
    password: heidarPasswordHashed,
    avatar: randomHeidarAvatarUrl,
    created_at: new Date(),
    updated_at: new Date(),
  });
  console.log(`Akun heidar dengan username 'heidar' dan ID ${heidarUserId} berhasil ditambahkan.`);

  const koinData = insertedUserIds.map(user => ({
    user_id: user.user_id,
    amount: Math.floor(Math.random() * 100) + 50,
    created_at: new Date(),
    updated_at: new Date(),
  }));

  // Tambahkan data koin untuk akun-akun lain
  koinData.push(
    { user_id: adminUserId, amount: 1000, created_at: new Date(), updated_at: new Date() },
    { user_id: justineUserId, amount: 750, created_at: new Date(), updated_at: new Date() },
    { user_id: renjieUserId, amount: 600, created_at: new Date(), updated_at: new Date() },
    { user_id: heidarUserId, amount: 900, created_at: new Date(), updated_at: new Date() }
  );

  try {
    await knex('koin').insert(koinData);
    console.log(`${koinData.length} data koin berhasil ditambahkan.`);
  } catch (error) {
    console.error('Error saat menambahkan koin:', error);
  }

  // Seed transaction_koin
  const transactionKoinData = [];
  const methodTargets = ['BCA', 'BRI', 'MANDIRI', 'GOPAY', 'DANA', 'OVO'];

  for (const user of insertedUserIds) {
    const numTransactions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numTransactions; i++) {
      transactionKoinData.push({
        user_id: user.user_id,
        number_target: Math.floor(Math.random() * 100000),
        method_target: faker.helpers.arrayElement(methodTargets),
        method_pay: null,
        amount: Math.floor(Math.random() * (50000 - 1000 + 1)) + 1000,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }
  }

  // Tambahkan transaksi koin untuk akun-akun lain
  transactionKoinData.push(
    { user_id: adminUserId, number_target: 111222, method_target: faker.helpers.arrayElement(methodTargets), method_pay: null, amount: 50000, status: 'success', created_at: new Date(), updated_at: new Date() },
    { user_id: justineUserId, number_target: 333444, method_target: faker.helpers.arrayElement(methodTargets), method_pay: null, amount: 25000, status: 'pending', created_at: new Date(), updated_at: new Date() },
    { user_id: renjieUserId, number_target: 555666, method_target: faker.helpers.arrayElement(methodTargets), method_pay: null, amount: 75000, status: 'success', created_at: new Date(), updated_at: new Date() },
    { user_id: heidarUserId, number_target: 777888, method_target: faker.helpers.arrayElement(methodTargets), method_pay: null, amount: 30000, status: 'pending', created_at: new Date(), updated_at: new Date() }
  );

  try {
    await knex('transaction_koin').insert(transactionKoinData);
    console.log(`${transactionKoinData.length} transaction_koin data added.`);
  } catch (error) {
    console.error('Error adding transaction_koin data:', error);
  }
};
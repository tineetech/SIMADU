// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'simadu_post',
      port: 6093,
      connectTimeout: 200000,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds'
    }
  },
  // mysql -h turntable.proxy.rlwy.net -u root -p ciXFaQEspTttnKcKDyNOPonpVGpXzaWI --port 45766 --protocol=TCP railway
  production: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'simadu_post',
      port: 6093,
      connectTimeout: 200000,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds'
    }
  },
};

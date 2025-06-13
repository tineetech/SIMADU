// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'dbpplg.smkn4bogor.sch.id',
      user: 'pplg',
      password: 'adminpplg2025!',
      database: 'simadu_laporan',
      port: 6093,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds'
    }
  },
};
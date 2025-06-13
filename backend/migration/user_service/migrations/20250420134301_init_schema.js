// migrations/xxxx_init_schema.js

exports.up = async function (knex) {
    // Users table
    await knex.schema
    .dropTableIfExists("transaction_koin")
    .dropTableIfExists("koin")
    .dropTableIfExists("users") // ← DROP DULU
    .createTable('users', (table) => {
      table.increments('user_id').primary();
      table.string('username').notNullable().unique();
      table.string('first_name').nullable();
      table.string('last_name').nullable();
      table.text('avatar').defaultTo(null);
      table.string('email').notNullable().unique();
      table.bigInteger('phone').unique().nullable();
      table.enu('role', ['guest', 'admin']).notNullable();
      table.string('password').notNullable();
      table.text('password_reset_token').nullable();
      table.text('google_id').nullable();
      table.text('verify_email_token').nullable();
      table.boolean('status').notNullable().defaultTo(true);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  
    // Koin table
    await knex.schema.createTable('koin', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
           .references('user_id').inTable('users')
           .onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('amount').notNullable().defaultTo(0);
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  
    // Transaction Koin table
    await knex.schema.createTable('transaction_koin', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().notNullable()
           .references('user_id').inTable('users')
           .onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('target').notNullable();
      table.string('method_target').notNullable();
      table.string('method_pay').nullable();
      table.integer('success_convert_amount').nullable();
      table.enu('status', ['pending', 'proses', 'success']).notNullable().defaultTo('pending');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('transaction_koin');
    await knex.schema.dropTableIfExists('koin');
    await knex.schema.dropTableIfExists('users');
  };
  
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("notifikasi", (table) => {
    table.increments("id").primary();

    // Simpan ID user & laporan tanpa foreign key
    table.integer("user_id").unsigned().notNullable();
    table.integer("laporan_id").unsigned().notNullable();

    // Konten notifikasi
    table.string("title").notNullable();
    table.text("message").notNullable();

    // Status dan timestamps
    table.boolean("is_read").defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("notifikasi");
};

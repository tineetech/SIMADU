/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema
    .dropTableIfExists("laporan")
    .createTable("laporan", (table) => {
    table.increments("id").primary();
    table.integer("user_id").unsigned().notNullable(); // Bisa tambahkan FK kalau ada tabel users
    table.text("image").notNullable();
    table.text("location_latitude").notNullable();
    table.text("location_longitude").notNullable();
    table.text("description").notNullable();
    table.date("event_date").notNullable();
    table.enu("category", ["jalan_rusak", "sampah_menumpuk", "pju_mati", "banjir", "lainnya"]).notNullable().defaultTo("lainnya");
    table.enu("type_verification", ["ai", "automatic", "manual"]).notNullable().defaultTo("ai");
    table.enu("status", ["pending", "proses", "failed", "success"]).notNullable().defaultTo("pending");
    table.text("notes").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("laporan");
};

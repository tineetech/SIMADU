/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  // Tabel utama: postingan
  await knex.schema.createTable("postingan", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNullable();
    table
      .enum("type", ["text", "image", "video", "polling"])
      .notNullable()
      .defaultTo("text");
    table.text("content").notNullable();
    table.enum("status", ["active", "draft"]).notNullable().defaultTo("active");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Tabel khusus: postingan_image
  await knex.schema.createTable("postingan_image", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.text("image").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Tabel khusus: postingan_video
  await knex.schema.createTable("postingan_video", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.text("url_video").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Tabel polling baru
  await knex.schema.createTable("postingan_polling_options", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE");
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("postingan_polling_votes", (table) => {
    table.increments("id").primary();
    table
      .integer("option_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan_polling_options")
      .onDelete("CASCADE");
    table.integer("user_id").unsigned().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["option_id", "user_id"]);
  });

  // Tabel tambahan: postingan_likes
  await knex.schema.createTable("postingan_likes", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("user_id").unsigned().notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.unique(["post_id", "user_id"]);
  });

  await knex.schema.createTable("postingan_reports", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("user_id").unsigned().notNullable(); 
    table.text("reason").notNullable(); 
    table
      .enum("status", ["pending", "resolved", "rejected"])
      .defaultTo("pending");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("postingan_comments", (table) => {
    table.increments("id").primary();
    table
      .integer("post_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("user_id").unsigned().notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.index(["post_id"], "idx_comment_post");
    table.index(["user_id"], "idx_comment_user");
  });

  await knex.schema.createTable("postingan_comment_replies", (table) => {
    table.increments("id").primary();
    table
      .integer("comment_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("postingan_comments")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");
    table.integer("user_id").unsigned().notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
    
    table.integer("parent_reply_id").unsigned().nullable()
      .references("id")
      .inTable("postingan_comment_replies")
      .onDelete("CASCADE")
      .onUpdate("CASCADE");

    table.index(["comment_id"], "idx_reply_comment");
    table.index(["user_id"], "idx_reply_user");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("postingan_comment_replies");
  await knex.schema.dropTableIfExists("postingan_reports");
  await knex.schema.dropTableIfExists("postingan_comments");
  await knex.schema.dropTableIfExists("postingan_likes");
  await knex.schema.dropTableIfExists("postingan_polling_votes");
  await knex.schema.dropTableIfExists("postingan_polling_options");
  await knex.schema.dropTableIfExists("postingan_video");
  await knex.schema.dropTableIfExists("postingan_image");
  await knex.schema.dropTableIfExists("postingan");
};
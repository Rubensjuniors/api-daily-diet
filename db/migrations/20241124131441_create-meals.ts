import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (t) => {
    t.uuid('id').primary()
    t.string('name')
    t.string('description')
    t.timestamp('datetime')
    t.boolean('in_diet')
    t.uuid('user_id').after('id').index()
    // t.uuid('user_id')
    //   .notNullable()
    //   .references('id')
    //   .inTable('users')
    //   .onDelete('CASCADE')
    //   .onUpdate('CASCADE')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

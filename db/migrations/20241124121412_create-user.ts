import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (t) => {
    t.uuid('id').primary()
    t.string('firstName')
    t.string('lastName')
    t.string('email')
    t.string('phone_number')
    t.boolean('is_active')
    t.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    t.timestamp('updated_at')
    t.uuid('session_id').after('id').index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

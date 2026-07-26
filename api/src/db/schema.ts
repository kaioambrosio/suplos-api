import { mysqlTable, int, varchar, text, decimal, timestamp } from 'drizzle-orm/mysql-core'

export const products = mysqlTable('products', {
  id_product: int('id_product').autoincrement().primaryKey(),
  id_product_ext: varchar('id_product_ext', { length: 36 }).notNull(),
  name: text('name').notNull(),
  unit: varchar('unit', { length: 10 }).notNull(),
  category: varchar('category', { length: 255 }),
  group: varchar('group', { length: 255 }),
  min_stock: decimal('min_stock', { precision: 10, scale: 2 }),
  material_type: varchar('material_type', { length: 255 }),
  id_organization: int('id_organization').notNull(), // ← a coluna do filtro
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

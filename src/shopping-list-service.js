const ShoppingListService = {
  getAllItems(knex) {
    return knex.select('*').from('shopping_list')
  },
  updateList(knex, id, newItemFields ) {
    return knex('shopping_list')
     .where({ id })
     .update(newItemFields)
  },
  insertItem(knex, newItem) {
    return knex
    .insert(newItem)
    .into('shopping_list')
    .returning('*')
    .then(rows => {
      return rows[0]
    })
  },
  getById(knex, id) {
     return knex.from('shopping_list').select('*').where('id', id).first()
   },
   deleteItem(knex, id) {
     return knex('shopping_list')
      .where({ id })
      .delete()
  }
}

module.exports = ShoppingListService
require("dotenv").config();
const knex = require("knex");

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function searchByString(searchTerm) {
  knexInstance
    .select('item_name', 'price', 'category')
    .from('shopping_list')
    .where('item_name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
      console.log(result)
    })
}

// searchByString('Fish tricks')

function paginateProducts(pageNumber) {
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
    .select('item_name', 'price', 'category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
      console.log(result)
    })
}

// paginateProducts(3)

function itemsAdded(daysAgo) {
  knexInstance
    .select('item_name', 'price', 'category', 'date_added')
    .where(
      'date_added',
      '>',
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .then(result => {
      console.log(result)
    })
}

itemsAdded(5)

function costPerCategory() {
  knexInstance
    .select('category')
    .sum('price as total')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
      console.log('COST PER CATEGORY')
      console.log(result)
    })
}

costPerCategory()
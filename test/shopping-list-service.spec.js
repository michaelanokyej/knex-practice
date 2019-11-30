const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping list Service object`, function () {
  let db
  let testShoppingList = [
    {
     id: 1,
     date_added: new Date('2029-01-22T16:28:32.615Z'),
      item_name: 'First test item!',
      checked: true,
      category: 'Main',
      price: '17.78'
    },
    {
     id: 2,
     date_added: new Date('2100-05-22T16:28:32.615Z'),
      item_name: 'Second test item!',
      checked: true,
      category: 'Main',
      price: '12.78'
    },
    {
     id: 3,
     date_added: new Date('1919-12-22T16:28:32.615Z'),
      item_name: 'Third test item!',
      checked: false,
      category: 'Main',
      price: '18.78'
    },
  ]

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    });
  });

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())

  after(() => db.destroy())

  describe(`getAllItems()`, () => {
    context(`Given 'shopping_list' has data`, () => {
      beforeEach(() => {
       return db
         .into('shopping_list')
         .insert(testShoppingList)
     })

    

     it(`updateList() updates an item from the 'shopping_list' table`, () => {
        const idOfItemToUpdate = 3
        const newItemData = {
          date_added: new Date(),
          item_name: 'updated test item!',
          checked: false,
          category: 'Breakfast',
          price: '15.78',
        }
        return ShoppingListService.updateList(db, idOfItemToUpdate, newItemData)
          .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
          .then(item => {
            expect(item).to.eql({
              id: idOfItemToUpdate,
              ...newItemData,
            })
          })
      })
      

     it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
       const itemid = 3
       return ShoppingListService.deleteItem(db, itemid)
         .then(() => ShoppingListService.getAllItems(db))
         .then(allItems => {
           // copy the test items array without the "deleted" item
           const expected = testShoppingList.filter(item => item.id !== itemid)
           expect(allItems).to.eql(expected)
         })
     })

     it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3
      const thirdTestitem = testShoppingList[thirdId - 1]
      return ShoppingListService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            item_name: thirdTestitem.item_name,
            category: thirdTestitem.category,
            date_added: thirdTestitem.date_added,
            checked: thirdTestitem.checked,
            price: thirdTestitem.price
          })
        })
    }) 


    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      // test that ShoppingListService.getallItems gets data from table
      return ShoppingListService.getAllItems(db)
      .then(actual => {
        expect(actual).to.eql(testShoppingList)
      })
    })
  })


  context(`Given 'shopping_list' has no data`, () => {
   it(`getallItems() resolves an empty array`, () => {
     return ShoppingListService.getAllItems(db)
       .then(actual => {
         expect(actual).to.eql([])
       })
   })
     

   it(`insertitem() inserts a new item and resolves the new item with an 'id'`, () => {
    const newitem = {
      date_added: new Date(),
      item_name: 'Inserted test item!',
      checked: false,
      category: 'Main',
      price: '20.78'
    }
    return ShoppingListService.insertItem(db, newitem)
      .then(actual => {
        expect(actual).to.eql({
          id: 1,
          date_added: newitem.date_added,
          item_name: newitem.item_name,
          checked: newitem.checked,
          category: newitem.category,
          price: newitem.price
        })
      })
   })
 })
})

})
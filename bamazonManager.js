var mysql = require("mysql");
var inquirer = require("inquirer");

//Set up database with mySQL

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 8889,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connection to database, asks what the manager wants to do and runs function based on response
connection.connect(function(err) {
    if (err) throw err;
    
    inquirer
    .prompt([
      {
        type: "list",
        message: "MENU OPTIONS",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "user_action"
      }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.user_action === "View Products for Sale") {
            seeAllProducts()
        }

        if (inquirerResponse.user_action === "View Low Inventory") {
            viewLowInventory()
        }

        if (inquirerResponse.user_action === "Add to Inventory") {
            addToInventory()
        }

        if (inquirerResponse.user_action === "Add New Product") {
            addNewProduct()
        }
    }) 
});

// view all products
function seeAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
          console.table(res)
          connection.end();
    })
};

// view products with 5 or less in inventory
function viewLowInventory() {
    connection.query("SELECT * FROM products where stock_quantity < 6", function(err, res) {
        if (err) throw err;
          console.table(res)
          connection.end();
    })
};

// asks the manager what they want to add to the inventory and runs addInventory function
function addToInventory() {
    inquirer.prompt([
      {
        type: "input",
        message: "Input the ID of the item you would like to add inventory to.",
        name: "inventoryToAdd"
      },{
        type: "input",
        message: "How many would you like to add?",
        name: "quantity"
      }
    ]).then(function(inquirerResponse) {
        addInventory(inquirerResponse.inventoryToAdd,inquirerResponse.quantity);
      })
  };

// updates inventory in table and displays the new quantity of that product
function addInventory(itemID,quantity) {
    connection.query("UPDATE PRODUCTS set stock_quantity = stock_quantity + " + quantity + " where item_id = " + itemID, function(err,res) {
        if (err) throw err;
      });
    connection.query("SELECT * FROM products WHERE item_id = " + itemID, function(err,res) {
        if (err) throw err;
        console.log("You've added " + quantity + " " + res[0].product_name + " to the warehouse. The total inventory for this item is now " + res[0].stock_quantity)
    })
    connection.end();
};

// asks the manager what new product they want to add and then runs addProduct 
function addNewProduct() {
    inquirer.prompt([
      {
        type: "input",
        message: "What item would you like to add?",
        name: "item"
      },{
        type: "input",
        message: "What department is it in?",
        name: "department"
      },{
        type: "input",
        message: "What is the price per item?",
        name: "price"
      },{
        type: "input",
        message: "How many would you like to add?",
        name: "quantity"
      }
    ]).then(function(inquirerResponse) {
        addProduct(inquirerResponse.item,inquirerResponse.department,inquirerResponse.price,inquirerResponse.quantity);
      })
  };

// inserts new product into table
function addProduct(item, department, price, quantity) {
    connection.query("insert into products set ?",
      {
        product_name: item,
        department_name: department,
        price: price,
        stock_quantity: quantity
      },
      function(err, res) {
        if (err) throw err;
      }
    );

    connection.query("SELECT * FROM products WHERE product_name = ?", [item], function(err,res) {
        if (err) throw err;
        console.log("ITEM ADDED")
        console.table(res)
    })

    connection.end();
  }
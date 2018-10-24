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

// connection to database, calls first function
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    seeAll()
});

// displays all items and then runs function to ask customer what they want to buy
function seeAll() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
        console.table(res)
        // connection.end();
        whatToBuy()  
  })
}

// asks customer what they want to buy
function whatToBuy() {
  inquirer.prompt([
    {
      type: "input",
      message: "Input the ID of the item you would like to buy.",
      name: "productToBuy"
    },{
      type: "input",
      message: "How many would you like to buy?",
      name: "quantity"
    }
  ]).then(function(inquirerResponse) {
   connection.query("SELECT stock_quantity FROM products where item_id = ?", [inquirerResponse.productToBuy], function(err, res) {
        if (err) throw err;

        // if there isn't enough stock returns error message
        if (res[0].stock_quantity < inquirerResponse.quantity) {
            console.log("Insufficient quantity!")
            connection.end();
        } else {
            // runs purchase function
            // console.log(res[0].stock_quantity)
            purchase(inquirerResponse.productToBuy,inquirerResponse.quantity);
        };
      }); 
    })
};

// updates the stock quantity and product sales in the table, displays the total of the order
function purchase(itemID,quantity) {
    connection.query("UPDATE PRODUCTS set stock_quantity = stock_quantity - " + quantity + " where item_id = " + itemID, function(err,res) {
        if (err) throw err;
      });

    connection.query("UPDATE PRODUCTS set product_sales = product_sales + (price * " + quantity + ") where item_id = " + itemID, function(err,res) {
        if (err) throw err;
      });

    connection.query("SELECT price * " + quantity + " as cost FROM products WHERE item_id = " + itemID, function(err,res) {
        if (err) throw err;
        console.log("Your total is: $" + res[0].cost)
    })
    connection.end();
};






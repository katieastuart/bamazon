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

// connection to database. asks supervisor what they want to do and then runs appropriate function
connection.connect(function(err) {
    if (err) throw err;
    
    inquirer
    .prompt([
      {
        type: "list",
        message: "MENU OPTIONS",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "user_action"
      }
    ])
    .then(function(inquirerResponse) {
        if (inquirerResponse.user_action === "View Product Sales by Department") {
            seeAllSales()
        }

        if (inquirerResponse.user_action === "Create New Department") {
            addNewDepartment()
        }
    }) 
});

// view all sales and total profit by department
function seeAllSales() {
    connection.query("SELECT DISTINCT department_id, d.department_name, over_head_costs, sum(product_sales), sum(product_sales) - over_head_costs as total_profit FROM products p join departments d on p.department_name = d.department_name group by d.department_name", function(err, res) {
        if (err) throw err;
          console.table(res)
          connection.end();
    })
};

// asks supervisor which department they want to add and then runs addDepartment
function addNewDepartment() {
    inquirer.prompt([
      {
        type: "input",
        message: "What department would you like to add?",
        name: "department"
      },{
        type: "input",
        message: "What is the overhead cost?",
        name: "cost"
      }
    ]).then(function(inquirerResponse) {
        addDepartment(inquirerResponse.department,inquirerResponse.cost);
      })
  };

// inserts new department into the table
function addDepartment(department, cost) {
    connection.query("insert into departments set ?",
      {
        department_name: department,
        over_head_costs: cost
      },
      function(err, res) {
        if (err) throw err;
      }
    );

    connection.query("SELECT * FROM departments WHERE department_name = ?", [department], function(err,res) {
        if (err) throw err;
        console.log("DEPARTMENT ADDED")
        console.table(res)
    })

    connection.end();
  }


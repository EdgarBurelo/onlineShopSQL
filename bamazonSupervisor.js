let mysql = require("mysql");
let inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "toki2703",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    //connection.end();
    options();
});

function options() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Choose an option to continue",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(response) {
        switch (response.options) {
            case "View Product Sales by Department":
                departmentSales();
                break;
            case "Create New Department":
                createDepartment();
                break;
            default:
                console.log("somethingWrong Happened.");
                connection.end();
                break;
        }
    });
    
};

function departmentSales() {
    connection.query("SELECT x.department_id,x.department_name, x.over_head_costs, y.product_sales, y.product_sales - x.over_head_costs AS total_profit FROM departments x INNER JOIN(SELECT products.department_name, SUM(products.product_sales) AS product_sales FROM products GROUP BY department_name) y ON x.department_name = y.department_name;",
    function(err,res) {
        if (err) throw err;
        
        res.forEach(element => {
            console.log(`department_id: ${element.department_id} || department_name: ${element.department_name} || over_head_costs: ${element.over_head_costs} || product_sales: ${element.product_sales} || total_profit: ${element.total_profit}`);
        });
    });
    connection.end();
};

function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            name: "deptid",
            message: "Type the department id"
        },
        {
            type: "input",
            name: "DeptName",
            message: "Type the Department name"
        },
        {
            type: "input",
            name: "cost",
            message: "Type the Overhead of costs"
        },
        
    ]).then(function (response) {
        //console.log(response.ProdName,response.DeptName,response.price,response.qty);
        let regex = /^\d+$/;
        if (regex.test(response.deptid) && regex.test(response.cost)) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_id: response.deptid,
                    department_name: response.DeptName,
                    over_head_costs: response.cost
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " product inserted!\n");
                });
        } else {
            console.log("Make sure the id and the costs are numbers");
        }
        connection.end();
    });
}
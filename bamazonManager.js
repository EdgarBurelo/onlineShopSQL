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

connection.connect(function(err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    //connection.end();
    showOptions();
});

function showOptions() {
    inquirer.prompt([
        {
            type:"list",
            name:"options",
            message:"Choose an option to continue",
            choices:["View Products for Sale","View Low Inventory", "Add to Inventory","Add New Product"]
        }

    ]).then(function(response) {
        
        //console.log(response.options);
        //connection.end();
        switch(response.options){
            case "View Products for Sale":
                first()
                break;
            case "View Low Inventory":
                second()
                break;
            case "Add to Inventory":
                queryThird()
                break;
            case "Add New Product":
                fourth()
                break;
            default:
                console.log("somethingWrong Happened.");
                connection.end();
                break;
        }
    });
};

function first() {
    connection.query("SELECT * from products",function(err,res) {
        if(err) throw err;
        res.forEach(element => {
            console.log(`Id: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price} || Qty: ${element.stock_quantity}`);
        });
    });
    connection.end();
};

function second() {
    connection.query("SELECT * from products WHERE stock_quantity<'5'",function(err,res) {
        if(err) throw err;
        res.forEach(element => {
            console.log(`Id: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price} || Qty: ${element.stock_quantity}`);
        });
    });
    connection.end();
};

function third(query1) {
    //console.log(query1);
    let prodArray = [];
    query1.forEach(element => {
        prodArray.push(element.product_name);
    });
    inquirer.prompt([
        {
            type:"list",
            name:"prods",
            message:"Choose an option to continue",
            choices: prodArray

        }
    ]).then(function(response) {
        //console.log(response.prods)
        let prod =  response.prods;
        inquirer.prompt([
            {
                type:"input",
                message:"How much product do you want to add?",
                name:"productQty"
            }
        ]).then(function(ans) {
            let QTY = "";
            let ID = "";
            query1.forEach(element => {
                if (element.product_name == prod) {
                    QTY = parseInt(element.stock_quantity)+ parseInt(ans.productQty);
                    ID = element.item_id;
                }
            });
            // console.log(QTY);
            // console.log(ID);
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: QTY
                },
                {
                    item_id: ID
                },
            ],
            function(err,res){
                if(err) throw err;
                console.log(res.affectedRows + " products updated!\n");
                connection.end();
            });

        });
    });
    
};

function queryThird() {
    connection.query("SELECT * from products",function(err,res) {
        if(err) throw err;
        third(res);
    });
};

function fourth() {
    inquirer.prompt([
        {
            type:"input",
            name:"ProdName",
            message:"Type the product name"
        },
        {
            type:"input",
            name:"DeptName",
            message:"Type the Department name"
        },
        {
            type:"input",
            name:"price",
            message:"Type the Price of the product"
        },
        {
            type:"input",
            name:"qty",
            message:"Type the stock quantity"
        }
    ]).then(function(response) {
        console.log(response.ProdName,response.DeptName,response.price,response.qty);
        connection.end();
    });
}
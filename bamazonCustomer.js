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
    PrintRows()
});

function PrintRows() {
    //console.log("Selecting all Songs...\n");
    connection.query("SELECT * FROM products",
    // {
    //     item_id: algo
    // }
    
    function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      res.forEach(element => {
          console.log(`Id: ${element.item_id} || Product Name: ${element.product_name} || Price: ${element.price}`);
      });  
      selectProduct(res.length);
      //connection.end();
    });
};

function selectProduct(size) {
    inquirer.prompt([
        {
            type: "input",
            message: "Select the Product Id",
            name: "productId"
        }
    ]).then(function(response) {
        if(response.productId <= size && response.productId > 0) {
            
            connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: response.productId
            },
            function(err,res2){
                if(err) throw err;
                qtyClient(res2);
            });
            
        } else {
            console.log("The product selected Doesn't exist!!!");
            connection.end();
        }
    });
};

function qtyClient(item) {
    inquirer.prompt([
        {
            type: "input",
            message: "Select the Qty Required",
            name: "productQty"
        }
    ]).then(function(response) {
        if(item[0].stock_quantity < response.productQty){
            console.log("There is not enogh Product, The order cannot go through!");
        } else {
            console.log("-------------------------------\nYour order has benn placed\nThe total of your purchase is: $"+response.productQty*item[0].price +" USD\n------------------------------------");
            const resultQty = item[0].stock_quantity - response.productQty;
            const moneyTot = item[0].product_sales + (response.productQty * item[0].price);
            connection.query("UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: resultQty,
                    product_sales: moneyTot
                },
                {
                    item_id: item[0].item_id
                },
            ],
            function(err,res){
                if(err) throw err;
                console.log(res.affectedRows + " products updated!\n");
            });
            //UPDATE songs
            //SET genre = "Heavy Metal"
            //WHERE artist="Iron Maiden";
        }
        // console.log(item[0].stock_quantity);
        // console.log(response.productQty);
        
        connection.end();
    });
}
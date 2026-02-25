let express=require("express");


const { productList, productListInsert, productUpdate, productDelete, productUpdateRow } = require("../controllers/web/ProductList");
const verifyAdmin = require("../../AdminAuthMiddleware");


let productRoutes=express.Router();

productRoutes.get("/books-view",productList);
productRoutes.post("/books-insert",verifyAdmin,productListInsert);
productRoutes.get("/books-update/:id",productUpdate);
productRoutes.put("/product-update/:id",verifyAdmin,productUpdateRow);
productRoutes.delete("/books-delete/:id",verifyAdmin,productDelete);
module.exports={productRoutes};
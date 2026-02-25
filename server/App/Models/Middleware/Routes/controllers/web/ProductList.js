const productModel = require("../../../../ProductModel");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// let productListInsert = (req, res) => {
//   let {title,author,price,ratings,image,description,category} = req.body; //data from api

//   let productData = new productModel({
//     title,author,price,ratings,image,description,category
   
//   });
//   productData.save()
//     .then(() => {
//       res.send({ status: 1, mess: "Data Saved Sucessfully!" });
//     })
//     .catch((err) => {
//       res.send({ status: 0, mess: "Error While saving Data!", error: err });
//     });
// };


let productListInsert = (req, res) => {
  let products = req.body; //data from api

 productModel.insertMany(products).then(()=>{
  res.send({status:1,mess:"Data Saved Successfully!"});
 }).catch((err)=>{
  res.send({status:0,mess:"Error while saving Data!",error:err});
 });
};


let productList = async (req, res) => {
  try {
    // Fetch products from MongoDB
    let products = await productModel.find();
    
    // Process each product to convert image to Base64
    const productsWithBase64 = await Promise.all(
      products.map(async (product) => {
        try {
          // If image is already a Base64 string (starts with data:image), use as-is
          if (product.image.startsWith('data:image')) {
            return product;
          }
                  let base64Image=null;
          if(product.image){
            try{
              const imagePath=path.resolve(product.image);
              
              const imageBuffer=fs.readFileSync(imagePath);
              
              const ext=path.extname(imagePath).replace(".","");
              
              base64Image=`data:image/${ext};base64,${imageBuffer.toString("base64")}`
            }
            catch(e){
              // console.log(e)
            }
          }
          
          // If image is a URL, fetch and convert to Base64
          if (product.image.startsWith('http')) {
            const response = await axios.get(product.image, {
              responseType: 'arraybuffer'
            });
            const base64Image = Buffer.from(response.data, 'binary').toString('base64');
            const contentType = response.headers['content-type'] || 'image/jpeg';
            
            return {
              ...product._doc,
              image: `data:${contentType};base64,${base64Image}`
            };
          }
  
          
          
          
          // If no conversion possible, return original
          return product;
          
        } catch (error) {
          // console.error(`Error processing image for product ${product.title}:, error`);
          return product; // Return original if conversion fails
        }
      })
    );
    
    res.status(200).json({ 
      status: 1, 
      mess: "Product List with Base64 Images", 
      productList: productsWithBase64 
    });
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ 
      status: 0, 
      mess: "Server Error" 
    });
  }
};






let productUpdate= async (req, res) => {
      let productId = req.params.id;
      let product=await productModel.findOne({_id:productId})
      res.send({status:1, product})
  };
  let productDelete= async (req, res) => {
    let productId = req.params.id;
    let productUpdate = await productModel.deleteOne({ _id: productId });
    res.send({ status: 1, mess: "product deleted" });
  };
let productUpdateRow=async(req,res)=>{
    let productId = req.params.id;
    

    let productUpdate = await productModel.updateOne(
      { _id: productId },
      { $set:req.body}
    );
    res.send({ status: 1, mess: "Product updated" });
}


module.exports={productList,productListInsert,productUpdate,productDelete,productUpdateRow};
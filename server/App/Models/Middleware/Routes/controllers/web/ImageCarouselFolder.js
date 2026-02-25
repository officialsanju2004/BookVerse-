const ImageCarouselModel = require("../../../../ImageCarousel");
const axios = require('axios');
const fs = require('fs');
const path = require('path');

let ImageCarouselInsert = (req, res) => {
  let {image} = req.body; //data from api

  let ImageCarouselDataiInsert = new ImageCarouselModel({
    image
   
  });
  ImageCarouselDataiInsert.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!" });
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });
};

  let ImageCarouselView = async (req, res) => {
    try {
    // Fetch products from MongoDB
    let images = await ImageCarouselModel.find();
    
    // Process each product to convert image to Base64
    const imagesWithBase64 = await Promise.all(
      images.map(async (product) => {
        try {
          // If image is already a Base64 string (starts with data:image), use as-is
          if (product.image.startsWith('data:image')) {
            return product;
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
          
          // If image is a local file path (not recommended for production)
          if (fs.existsSync(product.image)) {
            const imageBuffer = fs.readFileSync(product.image);
            const base64Image = imageBuffer.toString('base64');
            const extname = path.extname(product.image).slice(1)||'jpeg';
            
            return {
              ...product._doc,
              image: `data:${extname};base64,${base64Image}`
            };
          }
          
          // If no conversion possible, return original
          return product;
          
        } catch (error) {
          console.error(`Error processing image for product ${product.title}:, error`);
          return product; // Return original if conversion fails
        }
      })
    );
    
    res.status(200).json({ 
      status: 1, 
      mess: "Product List with Base64 Images", 
      imageCarouselList: imagesWithBase64 
    });
    
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ 
      status: 0, 
      mess: "Server Error" 
    });
  }

};

let imageCarouselDelete= async (req, res) => {
    let imageCarouselId = req.params.id;
    let imageCarouselUpdate = await ImageCarouselModel.deleteOne({ _id: imageCarouselId });
    res.send({ status: 1, mess: "imageCarousel deleted" });
  };
module.exports={ImageCarouselInsert,ImageCarouselView,imageCarouselDelete};
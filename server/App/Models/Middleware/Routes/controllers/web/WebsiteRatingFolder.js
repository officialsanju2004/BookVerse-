const WebSiteRating = require("../../../../WebSiteRating");



let websiteratingInsert= (req, res) => {
    let {stars,author,reviewText } = req.body; //data from api
    
    let enquiry = new WebSiteRating({
      stars,author,reviewText
    });
    
    enquiry
      .save()
      .then(() => {
        res.send({ status: 1, mess: "Data Saved Sucessfully!" });
      })
      .catch((err) => {
        res.send({ status: 0, mess: "Error While saving Data!", error: err });
      });
  }
  let websiteratingData= async (req, res) => {
      let rating = await WebSiteRating.find();
      res.status(200).json({ status: 1, mess: "ratingList", websiteratingList :rating});
    };
    module.exports={websiteratingData,websiteratingInsert};
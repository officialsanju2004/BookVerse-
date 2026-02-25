const RatingModels = require("../../../../RatingModels");

  let ratingData= async (req, res) => {
      let rating = await RatingModels.find();
      res.status(200).json({ status: 1, mess: "ratingList", ratingList :rating});
    };
    module.exports={ratingData};
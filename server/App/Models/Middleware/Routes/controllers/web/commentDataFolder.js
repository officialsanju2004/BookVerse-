const commentModel = require("../../../../commentModel");

let commentDataInsert = (req, res) => {
  let {name ,comment,date} = req.body; //data from api

  let commentData = new commentModel({
   name,
    comment,
    date
   
  });
  commentData.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!" });
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });
};
let commentView= async (req, res) => {
    let comment = await commentModel.find();
    res.status(200).json({ status: 1, mess: "comment List", commentList : comment});
  }
module.exports={commentDataInsert,commentView};

const subscriberModel = require("../../../../SubscriberModel");



let subscriberDataInsert = (req, res) => {
  let {email} = req.body; //data from api

  let subscriberData = new subscriberModel({
    email
   
  });
  subscriberData.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!" });
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });
};
let subscriberDataView= async (req, res) => {
      let user = await subscriberModel.find();
      res.status(200).json({ status: 1, mess: "userList", subscriberList :user});
    };

let subscriberDelete= async (req, res) => {
    let productId = req.params.id;
    let productUpdate = await subscriberModel.deleteOne({ _id: productId });
    res.send({ status: 1, mess: "Subscriber deleted" });
  };



module.exports={subscriberDataInsert,subscriberDataView,subscriberDelete};
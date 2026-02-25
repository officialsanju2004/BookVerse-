const UserModel = require("../../../../UserInfoModel");

let userInsert = (req, res) => {
 
  let { name, email,favoriteGenre } = req.body; //data from api

  let userList = new UserModel({
    name, email,favoriteGenre
   
  });
  
  userList.save()
    .then(() => {
      res.send({ status: 1, mess: "Data Saved Sucessfully!" ,userList:userList});
      
    })
    .catch((err) => {
      res.send({ status: 0, mess: "Error While saving Data!", error: err });
    });
    
  

  };

  let userData= async (req, res) => {
      let user = await UserModel.find();
      res.status(200).json({ status: 1, mess: "userList", userList :user});
    };

      let userDelete= async (req, res) => {
    let userId = req.params.id;
    let userUpdate = await UserModel.deleteOne({ _id: userId });
    res.send({ status: 1, mess: "user deleted" });
  };





    module.exports={userData,userInsert,userDelete};
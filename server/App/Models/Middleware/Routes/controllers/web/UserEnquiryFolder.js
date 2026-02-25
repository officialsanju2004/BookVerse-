const enquiryModel = require("../../../../EnquiryModel");

let enquiryInsert= (req, res) => {
    let { name, email, subject, message } = req.body; //data from api
    
    let enquiry = new enquiryModel({
      name,
      email,
      subject,
      message 
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

let enquiryDelete= async (req, res) => {
    let enquiryId = req.params.id;
    let enquiryUpdate = await enquiryModel.deleteOne({ _id: enquiryId });
    res.send({ status: 1, mess: "enquiry deleted" });
  }

let enquiryView= async (req, res) => {
    let enquiry = await enquiryModel.find();
    res.status(200).json({ status: 1, mess: "Enquiry List", enquiryList : enquiry});
  }


  module.exports={enquiryInsert,enquiryDelete,enquiryView};
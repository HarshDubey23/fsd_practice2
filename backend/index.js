const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/* Middleware */
app.use(express.json());
app.use(express.static("public"));

/* MongoDB Connection */
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

/* Schema */
const patientSchema = new mongoose.Schema({
name:String,
age:Number,
gender:String,
phone:String,
disease:String,
doctor:String,
admissionDate:{
type:Date,
default:Date.now
}
});

const Patient = mongoose.model("Patient",patientSchema);

/* CREATE */
app.post("/patients", async(req, res) => {
  try {
    const patient = new Patient(req.body);
    await patient.save();
    res.json(patient);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* GET ALL */
app.get("/patients", async(req, res) => {
  try {
    const patients = await Patient.find().sort({admissionDate: -1});
    res.json(patients);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* UPDATE */
app.put("/patients/:id", async(req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new: true}
    );
    res.json(patient);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* DELETE */
app.delete("/patients/:id", async(req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.json({message: "Deleted"});
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

/* Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});
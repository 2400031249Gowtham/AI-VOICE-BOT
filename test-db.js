const mongoose = require("mongoose");

const uri = "mongodb+srv://Hanexis_Voice_Ai_bot:Hanexis4675@voxbridge-cluster.qgcr13s.mongodb.net/voxbridge_db?retryWrites=true&w=majority";

console.log("Starting test connection to:", uri);
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Mongoose connected to voxbridge_db!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Mongoose connection failed:", err.message);
    process.exit(1);
  });

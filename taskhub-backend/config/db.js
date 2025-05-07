const mongoose = require('mongoose');

const connectDB = async () => {
  try 
  {
    await mongoose.connect("mongodb+srv://gananakkina19:je6amPGTtA2apJKH@taskhub-cluster-1.ibb40up.mongodb.net/");
    console.log('MongoDB Connected');
  } 
  catch (err) 
  {
    console.log("Something went wrong while connecting to MongoDB");
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;

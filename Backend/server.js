require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3000;
const connectDB = require("./src/db/db");


// Database Connection
connectDB();


// Run Server
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
});
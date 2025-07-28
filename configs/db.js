const mongoose = require("mongoose");

const connectToDB = async () =>{

    try{
        if(mongoose.connections[0].readyState){
        return true;     
    }else{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connect to db succesfully"); 
    }
    }catch(err){
        console.log("db connection had erorr", err);  
    }
};
export default connectToDB;
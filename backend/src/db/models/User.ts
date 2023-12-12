import mongoose from "mongoose";

// schema for user details
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    date : {
        type : Date,
        default : Date.now
    }
});


const User = mongoose.model('user', userSchema);
// create indices for unique data
User.createIndexes();
// export the user model
export default User;
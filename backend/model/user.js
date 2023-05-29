import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    FirstName : {
        type:String,
    },
    LastName:
    {
        type:String
    },
    username:{
        type:String,
        require:true
    },
    email: 
    {
        type:String,
        require:true
    },
    contact:
    {
        type:Number
    },
    Age:
    {
        type:Number
    },
    password:
    {
        type:String,
        require:true
    },
    followers:
    {
        type:Array
    } 
    ,
    SavedPosts:
    {
        type:Array
    },
    ProfilePic:
    {
        type:String
    },
    UpvotedPosts:
    {
        
    },
    DownvotedPosts:
    {
        
    }
})

//module.exports = mongoose.model('user',userSchema);
export default mongoose.model('user',userSchema);
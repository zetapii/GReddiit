import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    Text : 
    {
        type:String,
    },
    PostedBy:
    {
        type:String,
        require:true
    },
    PostedIn:
    {
        type:String,
        require:true
    },
    Upvotes: 
    {
        type:Number,
    },
    Downvotes:
    {
        type:Number
    },
    Id:
    {
        type:String
    },
    Img:
    {
        type: String
    },
    Comments:
    {

    }
})

//module.exports = mongoose.model('user',userSchema);
export default mongoose.model('post',postSchema);
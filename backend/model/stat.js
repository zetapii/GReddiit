import mongoose from "mongoose";

const statSchema = new mongoose.Schema({
    Id: 
    {
        type:String
    },
    Reports:
    {

    },
    Posts:
    {

    },
    Followers:
    {

    },
    Visitors:
    {
        
    }
    //ReportedUsers:{Username:block}
})

//module.exports = mongoose.model('user',userSchema);
export default mongoose.model('statt',statSchema);
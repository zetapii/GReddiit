import mongoose from "mongoose";

const subGreddiitSchema = new mongoose.Schema({
    Name:  {
        type:String,
    },
    Description:
    {
        type:String,
    },
    Tags:
    {
        type:Array,
    },
    BannedKeywords: 
    {
        type:Array,
    },
    Followers:
    {
        type:Array 
    },
    FollowRequests:
    {
        type:Array
    },
    Moderator: 
    {
        type:String
    },
    Id: 
    {
        type:String
    },
    ReportedPages:
    {
        ReportedBy:
        {
            type:String
        },
        ReportedPerson:
        {
            type:String
        },
        Concern:
        {
            type:String
        },
        Text:
        {
            type:String
        },
        SubGreddiitId:
        {
            type:String
        },
        Id:
        {
            type:String
        },
        time:
        {
            
        }
    },
    BlockedUsers:
    {
        
    },
    Image:
    {

    }
})

//module.exports = mongoose.model('user',userSchema);
export default mongoose.model('SubGreddiit',subGreddiitSchema);
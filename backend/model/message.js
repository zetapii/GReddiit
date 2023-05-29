import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    Id: {
        type:String
     },
    OtherId:
    {
        type:String
     },
    Data:
    {
        /*   Message:
        {
            Type:String
        },
        Epoch:
        {
            Type:String
        }*/
    },
})

//module.exports = mongoose.model('user',userSchema);
export default mongoose.model('message',messageSchema);
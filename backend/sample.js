import JSONdb  from 'simple-json-db';
import nodemailer from 'nodemailer';
import sessions from 'express-session';
import cookieParser from 'cookie-parser';
import express  from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local'
import 'body-parser'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import multer  from 'multer';
import fs, { mkdirSync, stat }  from 'fs';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv'
// Hashes the password using bcrypt

dotenv.config({ path: './.env' });

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Hashing failed', error);
  }
}

// Compares the password with its hash using bcrypt
async function comparePassword(password, hash) {
  try {
    const match = await bcrypt.compare(password, hash);
    console.log("comparing password")
    console.log(match)
    return match;
  } catch (error) {
    throw new Error('Comparison failed', error);
  }
}

function generateAccessToken(username) 
{
  return jwt.sign(username, process.env.SECRET, { expiresIn: '180000s' });
}

const __filename = fileURLToPath(import.meta.url);


const PORT = process.env.port || 5000;
const app = express();
//app.use(cors());

const oneDay = 1000 * 60 * 60 * 24;
app.use(cookieParser());
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json({limit: '50mb'}))


//defining mongoose schema
import mongoose from 'mongoose';
import user from './model/user.js'
import post from './model/post.js';
import subGreddiit from './model/subGreddiit.js';
import message from './model/message.js'
import statt from './model/stat.js';
import bodyParser from 'body-parser';

const User = user;
const Post = post;
const SubGreddiit=subGreddiit;
const Message=message;
const Stat=statt
const uri = process.env.URI 

// Connect to the Atlas cluster
mongoose.connect(uri, {
  useNewUrlParser: true, 
  useUnifiedTopology: true,
  dbName: 'test'
});
const connection = mongoose.connection;

// Connection error handler
connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err}`);
});

// Connection success handler
connection.once('open', () => {
  console.log('Successfully connected to the Atlas cluster');
});

app.use(express.urlencoded({ extended: true}));

app.post('/login',async function(req,res) {
  try 
  {
      if(!req.body.username || !req.body.password)
      {
        res.send({"message":"empty username or password"});
      }
      const users = await User.findOne({username:req.body.username});      
      if(!users || users===null) //user doesn't exists
      {
          console.log("sending error")
          res.send({err:"incorrect username or password"})
          return
      }
      else if((await comparePassword(req.body.password,users["password"]) ))
      {
        const token = generateAccessToken({ username: req.body.username });
        res.send({message:token});
        console.log({token:token})
      }
      else 
      {
        res.send({message:"error"})
      }
  }
  catch(e)
  {
    console.log(e)
    res.send({message:"error"})
  }
});

app.post('/verify',async function(req,res){
  const token  = req['body']['jwt']
  console.log("i am being verified")
  jwt.verify(token,process.env.SECRET, (err, verifiedJwt) => {
    if(err){
      res.send({message:"error"})
    }else{
      console.log(verifiedJwt)
      res.send({message:"success"})
    }
  })
});

app.post('/checkJoined', async function(req, res) {
  const token = req.body.jwt;
  jwt.verify(token, process.env.SECRET, async (err, verifiedJwt) => {
    if (err) {
      res.send({message: "error"});
      return;
    } else {
      console.log(verifiedJwt);
      try {
        const mod = await SubGreddiit.findOne({Id: req.body.Id});
        const followers = mod["Followers"];
        let matchFound = false;
        followers.forEach(elem => {
          if (JSON.stringify(elem) === JSON.stringify(verifiedJwt["username"])) {
            matchFound = true;
          }
        });
        if (matchFound) {
          res.send({message: "success"});
        } else {
          res.send({message: "error"});
        }
      } catch(e) {
        res.send({message: "error"});
      }
    }
  });
});


app.post('/verifyPerm',async function(req,res){
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET, async(err, verifiedJwt) => {
    if(err){
      res.send({message:"error"})
    }else{
      console.log(verifiedJwt)
      try 
      {
        var mod = await SubGreddiit.findOne({Id:req.body.Id});
        mod = mod["Moderator"]
        console.log(mod)
        console.log(verifiedJwt["username"])
        if(JSON.stringify(mod)===JSON.stringify(verifiedJwt["username"]))
          res.send({message:"success"})
        else 
          res.send({message:"error"})
      }
      catch(e)
      {
        console.log("F")
        res.send({message:"error"})
      }
    }
  })
});

app.post('/EditProfile',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
    if(err){
      res.send({message:"error"})
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        const users = await User.find({username:verifiedJwt['username']});
        const to_update={'username':'','FirstName':'','LastName':'','email':'','contact':'','Age':'','password':''};
        const a=['username','FirstName','LastName','email','contact','Age','password']
        console.log(users)
        var ok=true
        for(let i=0;i<7;i++)
        {
          let f=a[i]
          if(req['body'][a[i]]!=undefined && req['body'][a[i]]!=null)
            to_update[a[i]]=req['body'][a[i]]
          else 
            to_update[a[i]]=users[0][a[i]]
          if(i==4 || i==5)
          {
            if(!Number.isInteger(to_update[a[i]]) && to_update[a[i]]!=undefined && to_update[a[i]]!=null && to_update[a[i].length>0])
            {
              console.log(to_update[a[i]])
              ok=false;
            }
            to_update[a[i]]=Number(to_update[a[i]])
          }
          else 
          {
            to_update[a[i]]=String(to_update[a[i]])
          }
        }
        if(ok==false)
        {
            console.log("error")
            res.send({message:"error"})
            return 
        }
        for(let i=1;i<7;i++)
        {
          await User.updateOne({username:verifiedJwt['username']},{$set:{[a[i]]:to_update[a[i]]}})
        }
        res.json(to_update);
      }
      catch(err){
        console.log(err);
      }
    }
  })
})

app.post('/getUserDetails',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
    if(err){
      res.send({message:"error"})
    }else{
      console.log(verifiedJwt)
      try{
        const users = await User.find({username:verifiedJwt['username']});
        res.json(users);
      }
      catch(err){
        console.log(err);
      }

    }
  })
})

app.post('/deleteSubGreddiitUsers',async function(req,res)
{
  const token  = req['body']['jwt']
  const Id=req['body']['Id']
  var del_follower=req['body']['del']
  console.log(del_follower)
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      res.send({message:"error"})
      return
    }else{
      try{
        if(del_follower==verifiedJwt["username"])
        {
        }
        var cur = await SubGreddiit.findOne({Id:Id});
        if(cur['Moderator']==verifiedJwt['username'
        ])
        {
          res.send({"message":"moderator can't leave"})
          return 

        }
        cur=cur['Followers']
        cur=cur.filter(i=>i!=verifiedJwt["username"])
        try{
        await SubGreddiit.updateOne({Id:Id},{"$pull":{"Followers":verifiedJwt["username"]}})
        await SubGreddiit.updateMany({Id:Id},{"$push":{"BlockedUsers":verifiedJwt["username"]}})
        res.send({"message":"sucess"})
        }
        catch(e)
        {
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })

})

app.post('/rejectSubGreddiitRequest',async function(req,res)
{
  const token  = req['body']['jwt']
  const Id=req['body']['Id']
  const del=req['body']['del']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(Id)
        var cur = await SubGreddiit.findOne({Id:Id});
        var current = cur['Requests']
        if(current==null || current==undefined)
        current=[]
        current=current.filter(i=>i!=new_follower)
        try{
        await SubGreddiit.updateOne({Id:Id},{"$pull":{"FollowRequests":del}})
        res.send({"message":"sucess"})
        }
        catch(e)
        {
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getStats',async function(req,res)
{

  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      try{

          var info = await Stat.findOne({Id:req['body']['Id']}) 
          const Name = await SubGreddiit.findOne({Id:req['body']['Id']})
          console.log("here is the info")
          console.log(Name)
          console.log(info)
          info = {...info}
          info = {...info["_doc"],Name:Name["Name"]}
          console.log(info)
          res.send({"message":info});
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })   
});

app.post('/creatSubGreddiitUsers',async function(req,res)
{
  const token  = req['body']['jwt']
  const Id=req['body']['Id']
  const new_follower=req['body']['new']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(Id)
        var cur = await SubGreddiit.findOne({Id:Id});
        cur=cur['Followers']
        cur.push(new_follower)
        var current = cur['Requests']
        if(current==null || current==undefined)
        current=[]
        current=current.filter(i=>i!=new_follower)
        try{
        await SubGreddiit.updateOne({Id:Id},{"$set":{"Followers":cur,"FollowRequests":current}})
        await Stat.updateOne({Id:Id},{"$addToSet":{Followers:new Date()}})
        res.send({"message":"sucess"})
        }
        catch(e)
        {
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

app.post('/getAllGreddiitPage',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        var cur = await SubGreddiit.find({Followers:{$in: verifiedJwt['username']}});
        if(cur==null || cur==undefined)
        cur=[]
        res.send(cur)
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getAllGreddiitPageNotFollowing',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        var cur = await SubGreddiit.find({Followers:{$nin: verifiedJwt['username']}});
        if(cur==null || cur==undefined)
        cur=[]
        res.send(cur)
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getSubGreddiitRequests',async function(req,res)
{
  const token  = req['body']['jwt']
  const Id=req['body']['Id']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(Id)
        var cur = await SubGreddiit.findOne({Id:Id});
        console.log(cur)
        cur=cur['FollowRequests']
        if(cur==null || cur==undefined)
        cur=[]
        var unique = cur.filter(onlyUnique);
        res.send({"message":unique})
      }
      catch(e)
      {
        res.send({"message":"error"})
      }
    }
    })
})

app.post('/creatSubGreddiitRequests',async function(req,res)
{
  const token  = req['body']['jwt']
  const Id=req['body']['Id']
  const new_request=req['body']['new']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(Id)
        var cur = await SubGreddiit.findOne({Id:Id});
        try
        {
        if(cur['BlockedUsers'].includes(verifiedJwt["username"]))
        {
            res.send({"message":"either you are blocked from this subgreddiit or you left it after joining"})
            return
        }
        }
        catch(e)
        {

        }
        cur=cur['FollowRequests']
        if(cur==null || cur==undefined)
        cur=[]
        cur.push(verifiedJwt['username'])
        console.log(cur)
        try{
        await SubGreddiit.updateOne({Id:Id},{"$set":{"FollowRequests":cur}})
        res.send({"message":"success"})
        }
        catch(e)
        {
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/creatSubGreddiit',async function(req,res)
{
  console.log("lmao")
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log("lmao")
        const users = await User.find({username:verifiedJwt['username']});
       // res.json(users);
       const BannedKeywordsList = String(req.body.BannedKeywords).replace(/,\s+/g, ',').split(',').map(keyword => keyword.trim());
       console.log(BannedKeywordsList)
       const f =uuidv4()
        const new_SubGreddiit = new SubGreddiit({Name:req['body']['Name'],Description:req['body']['Description'],Tags:String(req['body']['Tags']).split(","),Followers:Array(),BannedKeywords:BannedKeywordsList,Moderator:verifiedJwt['username'],Id:f,Image:req.body.img})
        
        console.log(new_SubGreddiit)
        new_SubGreddiit.save(async function (err, doc) {
      //   console.log(doc._id);
          if(err)
          {
            console.log(err)

            res.send({message:"failure"})
            return
          }
          else 
          {
            console.log("25rsuccess5")
            await SubGreddiit.updateOne({Id:f},{$push:{Followers:verifiedJwt["username"]}})
            const new_stat = new Stat({Id:f,Reports:[],Posts:[],Followers:[]});
            new_stat.save(function(err,doc)
            {
              if(err)
              {
                console.log(err)
              }
              else 
              {
                console.log(doc)
              }
            })
            res.send({message:"success"})
            return
          }});
      }
      catch(err){
        console.log(err);
        res.send({message:"error"})
        return
      }
    }
  })
})

app.post('/getAllTags',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        const users = await SubGreddiit.find({});
       // res.json(users);
        var cur=[]
        users.forEach(element => {
          console.log(element["Tags"])
          cur=cur.concat(element["Tags"])
        });
        cur=cur.filter((value,index,self)=>
        {
          return self.indexOf(value) === index;
        })
        res.send(cur)
        return
      }
      catch(err){
        console.log(err);
        res.send({message:"error"})
        return
      }
    }
  })
})


app.post('/getMySubGreddiitsUsersInfo',async function(req,res){
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      try{
        console.log(verifiedJwt)
        // res.json(users);
        var  all_users=await SubGreddiit.findOne({Id:req['body']['Id']});
        console.log(all_users)
        var blocked_user = all_users['BlockedUsers']
        if(blocked_user==null || !blocked_user)
        {
          blocked_user=[]
        }
        // all_users=all_users['Followers']
        var cur = all_users['Followers']
        
        var unique = cur.filter(onlyUnique);
        var uniqueOthers = blocked_user.filter(onlyUnique)
        console.log(uniqueOthers)
        res.send({"message":unique,"blocked":uniqueOthers});
      }
      catch(e)
      {
        console.log(e);
        console.log("here")
        res.send({message:"error"})
      }
    }
  })
}
);

app.post('/getMySubGreddiitsInfo',async function(req,res){
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      try{
        console.log(verifiedJwt)
        // res.json(users);
        var  all_subGreddiits=await SubGreddiit.find({Moderator:verifiedJwt['username']});
        for(let i=0;i<all_subGreddiits.length;i++)
        {
          all_subGreddiits[i]=JSON.parse(JSON.stringify(all_subGreddiits[i]));
          const cnt=await Post.count({PostedIn:all_subGreddiits[i].Id})
          Object.assign(all_subGreddiits[i],{"count":cnt})
        }        
        for(let i=0;i<all_subGreddiits.length;i++)
        {
          console.log(all_subGreddiits[i])
        }
        console.log("here")
        console.log(all_subGreddiits)
        res.send(all_subGreddiits);
        console.log()
      }
      catch(e)
      {
        console.log(e);
        console.log("here")

        res.send({message:"error"})
      }
    }
  })
}
);

app.post('/deleteMySubGreddiitsInfo',async function(req,res){
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      try{
        console.log(verifiedJwt)
        // res.json(users);
        await SubGreddiit.deleteOne({Id:req['body']['Id']});
        console.log("deletion done")
        req.send({"message":"succes"})
      }
      catch(e)
      {
        console.log(e);
        res.send({message:"error"})
      }
    }
  })
}
);

app.get('/find',async function(req,res){
try{
  const users = await User.find();
  res.json(users);
}
catch(err){
  console.log(err);
}});

app.get('/insert',async function(req,res){
  const new_user = new User({
    name: "zaid",
    password: "testing"
})

new_user.save(function (err, doc) {
      console.log(doc._id);
  });
})

app.get('/followers',async function(req,res)
{
  console.log("dfdsfsf")
    res.send(["zetapi","talz"]);
})


app.post('/addFollowing',async function(req,res)
{
  console.log("reached here")

  const token  = req['body']['jwt']
  const to_following=req['body']['new']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log("reached here")
        console.log(verifiedJwt['username'])
        if(verifiedJwt["username"]==to_following)
        {
          res.send({"message":"can't follow self"})
          return
        }
        var cur = await User.findOne({username:to_following});
        cur=cur['followers']
        cur.push(verifiedJwt["username"])
        try{
          const r=await User.updateOne({username:to_following},{"$set":{"followers":cur}})
          console.log(r)
          res.send(cur)
        }
        catch(e)
        {
          console.log(e)
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/addFollowers',async function(req,res)
{
  const token  = req['body']['jwt']
  const to_follow=req['body']['new']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        console.log(cur)
        cur=cur['followers']
        if(!cur.includes(to_follow))
          cur.push(to_follow)
        console.log(to_follow)
        try{
          const r=await User.updateOne({username:verifiedJwt['username']},{"$set":{"followers":cur}})
          console.log(r)
          res.send(cur)
        }
        catch(e)
        {
          console.log(e)
          res.send({"message":"error"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/removeFollowers',async function(req,res)
{
  const token  = req['body']['jwt']
  const to_remove=req['body']['del']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        console.log(cur)
        cur=cur['followers']
        cur=cur.filter(i=>i!=to_remove)
        console.log(cur)
        try{
          const r=await User.updateOne({username:verifiedJwt['username']},{"$set":{"followers":cur}})
          console.log(r)
          res.send(cur)
        }
        catch(e)
        {
          console.log(e)
          res.send({"message":"error"})
        }
     
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/removeFollowing',async function(req,res)
{
  const token  = req['body']['jwt']
  const to_remove=req['body']['del']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.updateOne({username:verifiedJwt['username']},{$pull:{followers:to_remove}});
        console.log(cur)
        res.send(cur)     
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})



app.post('/getFollowers',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        console.log("its the followers2")

        var cur = await User.findOne({username:verifiedJwt['username']});
        cur=cur['followers']
        var unique = cur.filter(onlyUnique);
        console.log("its the followers")
        console.log(unique)
        res.send(unique)
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getFollowing',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log("here")
      res.send({message:"error"})
      console.log()
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.find({followers:verifiedJwt['username']});
        console.log("try following")
        console.log(cur)
        var ret=[]
        cur.forEach(element => {
          ret.push(element['username'])
        });
        console.log(ret)
        var unique = ret.filter(onlyUnique);
        res.send(unique)
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/removeFollowing',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.find({followers:{$in:verifiedJwt['username']}});
        var ret=[]
        console.log(cur)
        cur.forEach(element => {
          ret.push(element['username'])
        });
        console.log(ret)
       res.send(ret)
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getAllPost',async function(req,res)
{
  console.log(req.body)
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        await Stat.updateOne({Id:req.body.PostedIn},{$push:{Visitors:new Date()}})
        var banned_keywords = await SubGreddiit.findOne({Id:req.body.PostedIn})
        banned_keywords = banned_keywords["BannedKeywords"]
        var cur = await Post.find({PostedIn:req.body["PostedIn"]});
        if(cur==null || cur==undefined)
          cur=[]
        for(let i=0; i<cur.length; i++) {
          for(let j=0; j<banned_keywords.length; j++) {
            if (banned_keywords[j].trim() === "") {
              continue;
            }
            const regex = new RegExp("\\b" + banned_keywords[j] + "\\b", "gi");
            cur[i]["Text"] = cur[i]["Text"].replace(regex, "*");
          }
          const ret=await SubGreddiit.find({Id:req.body.PostedIn,BlockedUsers:cur[i].PostedBy})
          console.log(ret)
          if(ret.length>0)
         {
              cur[i].PostedBy="BlockedUser"
         }
        }
        console.log(cur)
        res.send(cur)
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getBannedKeywords',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        var banned_keywordss = await SubGreddiit.findOne({Id:req.body.PostedIn})
        console.log("banned keyword")
        console.log(banned_keywords)
        var banned_keywords = banned_keywordss["BannedKeywords"]
        res.send({"message":banned_keywords,more:banned_keywordss})
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})
app.post('/getSpecificPost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        var posted = await Post.findOne({Id:req.body.Id})
        if(!posted.Comments)
          posted.Comments=[]
        res.send({"message":posted})
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})
app.post('/addCommentPost',async function(req,res)
{
  console.log("lmao")
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        var posted = await Post.updateOne({Id:req.body.Id},{$push:{Comments:req.body.comment}})
        console.log(posted)
        res.send({"message":"success"})
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/createPost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{ 
        if(!await Stat.findOne({Id:req.body.PostedIn}))
        {
          const new_stat = new Stat({Id:req.body.PostedIn,Reports:[],Posts:[],Followers:[]});
          new_stat.save(function(err,doc)
          {
            if(err)
            {
              console.log(err)
            }
          })
        }
        await Stat.updateOne({Id:req.body.PostedIn},{$push:{Posts:new Date()}})
        var banned_keywords = await SubGreddiit.findOne({Id:req.body.PostedIn})
        banned_keywords = banned_keywords["BannedKeywords"]
        const new_post = req.body;
        ///new Post({FirstNamePostedBy:verifiedJwt["username"],Upvotes:0,Downvotes:0})
        new_post["PostedBy"]=verifiedJwt["username"]
        new_post["Upvotes"]=0
        new_post["Downvotes"]=0
        new_post["Id"]=uuidv4()
        console.log(new_post)
        const neww_post=new Post(new_post)
        neww_post.save(function (err, doc) {
        //console.log(doc._id);
        if(err)
        {
          console.log("here")
          res.send("message:error");
        }
        });
        console.log("printing it")
        console.log(banned_keywords)
        const posed=req.body.Text.split(" ")
        for(let i=0;i<banned_keywords.length;i++)
        {
          for(let j=0;j<posed.length;j++)
          {
            console.log(banned_keywords[j])
            console.log(posed[j])
            if(banned_keywords[i]==posed[j])
            {
                console.log("banned hehe")
                res.send({"message":"banned"})
            }
          }
        }
        res.send("message:success")
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})


app.post('/reportPost',async function(req,res)
{
  const token  = req['body']['jwt']
  //req.body.ReportedBy
  //req.body.ReportedPerson
  //req.body.Concern
  //req.body.Text
  //req.body.SubGreddiitId
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
          const f = await SubGreddiit.findOne({Id:req.body.SubGreddiitId})
          if(f["Moderator"]==req.body.ReportedPerson)
          {
            //moderator can't be reported
            console.log(f["Moderator"],"is the moderator",req.body.ReportedPerson)
            res.send({"message":"moderator can't be reported"})
            return
          }
          if(req.body.ReportedPerson=="BlockedUser")
          {
            res.send({"message":"user already blocked"})
            return


          }
          const ret=await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$addToSet:{ReportedPages:{ReportedBy:verifiedJwt["username"],ReportedPerson:req.body.ReportedPerson,Concern:req.body.Concern,Text:req.body.Text,ReportedBy:verifiedJwt["username"],Id:req.body.Id,time:new Date()}}});
          if(!await Stat.findOne({Id:req.body.SubGreddiitId,Reports:{"reported post id":req.body.Id}}))
            await Stat.updateOne({Id:req.body.SubGreddiitId},{$addToSet:{Reports:{"reported post id":req.body.Id,"time":new Date()}}})
          console.log(ret)
          res.send({"message":ret});
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})
 
async function sendMailToUser(emailId,content)
{
  return new Promise((resolve,reject)=>{    
  const transporter = nodemailer.createTransport({
  port: 465,               // true for 465, false for other ports
  host: "smtp.gmail.com",
     auth: {
          user: 'zaidcoder@gmail.com',
          pass: 'bxmzigxhpndrqboj',
       },
  secure: true,
  });
  const mailData = {
    from: 'zaidcoder@gmail.com',  // sender address
      to: emailId,      // list of receivers
      subject: "Reported Post Subgreddiit",
      text: content
    };
    transporter.sendMail(mailData, function (err, info) {
      if(err)
      {
        //console.log(err);
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      }
      else
      {
       // console.log(info);
        resolve(true);
      }
   });
  });
} 

async function send_email_notification(obj,type,us)
{
    if(JSON.stringify(type)==JSON.stringify("removedreport"))
    {
      const user = await User.findOne({username:obj.ReportedBy})
      // console.log("sending mail")
      console.log(user["email"])
      if(user["email"].length>0)
          sendMailToUser(user["email"],"!!One of the reports by you has been ignored!!")
    }
    else if(JSON.stringify(type)==JSON.stringify("deletedReport"))
    {
      var user = await User.findOne({username:obj.ReportedBy})
      // console.log("sending mail")
      console.log(user["email"])
      if(user["email"].length>0)
          sendMailToUser(user["email"],"!!Based on your report ,one of the posts in subgreddiit  has been deleted!!")
      user = await User.findOne({username:obj.ReportedPerson})
      if(user["email"].length>0)
          sendMailToUser(user["email"],"!!Based on a reports,one of your post in the subgreddiit has been deleted!!")
    }
    else if (JSON.stringify(type) == JSON.stringify("blockedReport"))
    {
      var user = await User.findOne({username:obj.ReportedBy})
      console.log("sending mail")
      console.log(user["email"])
      if(user["email"].length>0)
          sendMailToUser(user["email"],"!!Based on your report ,one of the user in subgreddiit  has been blocked!!")
      user = await User.findOne({username:obj.ReportedPerson})
      console.log(us)
      console.log(user["username"])
      if(user["email"].length>0)
      {
        console.log("Sendnig email")
        console.log(user["email"])
          sendMailToUser(user["email"],"!!Based on reports,one of your post in the subgreddiit has been blocked!!")
      }
    }
}

app.post('/removeReport',async function(req,res)
{
  console.log("in remove report")
  console.log(req.body)
  const token  = req['body']['jwt']
  //req.body.ReportedBy
  //req.body.ReportedPerson
  //req.body.Concern
  //req.body.Text
  //req.body.SubGreddiitId
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        const obj=JSON.parse(JSON.stringify(req.body));
        delete obj.jwt;
        delete obj.SubGreddiitId;
        // console.log(req.body)
        // console.log(obj)
        const ret=await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$pull:{ReportedPages:{Id:req.body.Id,Concern:req.body.Concern}}});
        // console.log(ret)
        send_email_notification(req.body,"removedreport")
        res.send({"message":"success"});
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/deleteReportPost',async function(req,res)
{
  console.log("in remove report")
  console.log(req.body)
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$pull:{ReportedPages:{Id:req.body.Id}}});
        await Stat.updateOne({Id:req.body.SubGreddiitId},{$addToSet:{Reports:{"deleted post id":req.body.Id,"time":new Date()}}})
        const ret=await Post.deleteOne({Id:req.body.Id});
        console.log(ret)
        const retu=await SubGreddiit.findOne({Id:req.body.SubGreddiitId})
        send_email_notification(req.body,"deletedReport",req.body.ReportedBy)
        res.send({"message":retu["ReportedPages"]});
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getReportedPost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{        
        console.log("lmaomcdssmvsdlkvnfdklv")
        const ret = await SubGreddiit.findOne({Id:req.body.SubGreddiitId})
        console.log(ret)
        console.log(ret["ReportedPages"])
        if(JSON.stringify(ret["ReportedPages"])===JSON.stringify({}))
        {
            res.send({"message":[]});
            return
        }
        const minutes=100
        let previousTime = new Date(new Date().getTime() - 1000000 * 60 * minutes);
        await SubGreddiit.updateOne(
          { Id: req.body.SubGreddiitId },
          { $pull: { ReportedPages: { time: { $lt: previousTime } } } }
        );
        res.send({"message":((ret["ReportedPages"]))});
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/blockUserSubGreddiit',async function(req,res)
{
  console.log(req.body)
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$pull:{Followers:req.body.ReportedPerson}})
        const ret=await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$push:{BlockedUsers:req.body.ReportedPerson}});
        const retf=await SubGreddiit.updateOne({Id:req.body.SubGreddiitId},{$pull:{ReportedPages:{Id:req.body.Id}}});
        const retu=await SubGreddiit.findOne({Id:req.body.SubGreddiitId})
        send_email_notification(req.body,"blockedReport",req.body.ReportedBy)
        res.send({"message":retu["ReportedPages"]});
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/UpvotePost',async function(req,res)
{
  console.log("yes her")
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        const count = await User.findOne({username:verifiedJwt['username'],UpvotedPosts:req['body']['Id']})
        const count_ = await User.findOne({username:verifiedJwt['username'],DownvotedPosts:req['body']['Id']})
      
        console.log(count)
        console.log("here i am")

        if(count || count_)
        {
          console.log("here i am")
          //console.log(count)
          res.send({"message":"already"})
        }
        else 
        {
            await Post.updateOne({Id:req['body']['Id']},{$inc:{Upvotes:1}});
            await User.updateOne({username:verifiedJwt['username']},{$push:{UpvotedPosts:req['body']['Id']}})
            res.send({"message":"success"})
        }
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/DownvotePost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      return
    }else{
      console.log(verifiedJwt)
      try{
        const count = await User.findOne({username:verifiedJwt['username'],DownvotedPosts:req['body']['Id']})
        const count_ = await User.findOne({username:verifiedJwt['username'],UpvotedPosts:req['body']['Id']})

        if(count || count_)
        {
          res.send({"message":"already"})
        }
        else 
        {
          await Post.updateOne({Id:req['body']['Id']},{$inc:{Downvotes:1}});
          await User.updateOne({username:verifiedJwt['username']},{$push:{DownvotedPosts:req['body']['Id']}})
          res.send({"message":"success"})

        }
        res.send({"message":"success"})
      }
      catch(e)
      {
        console.log(e)
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/getSavedPost',async function(req,res)
{

  const token  = req['body']['jwt']
  console.log(token)
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        console.log(cur)
        cur=cur['SavedPosts']
        var ret=await Post.find({Id:cur});
        if(ret==null || ret==undefined)
        ret=[]
        console.log("hehe")
        console.log(cur)
        console.log(ret)
        for(let i=0;i<ret.length;i++)
        {
          ret[i]=ret[i].toObject();
          console.log("running here i am ",ret.length)
          var banned_keywords = await SubGreddiit.findOne({Id:ret[i].PostedIn})
          if(!banned_keywords)
          {
            console.log("lmao")
            ret[i]="-1";
            continue;
          }
          else 
          {
          
          
          console.log("Ff ",banned_keywords)
          banned_keywords = banned_keywords["BannedKeywords"]
          console.log(banned_keywords)
          for(let i=0; i<ret.length; i++) {
            for(let j=0; j<banned_keywords.length; j++) {
              if (banned_keywords[j].trim() === "") {
                continue;
              }
              const regex = new RegExp("\\b" + banned_keywords[j] + "\\b", "gi");
             ret[i]["Text"] = ret[i]["Text"].replace(regex, "*");
              
            }
          }

          const name = await SubGreddiit.findOne({Id:ret[i].PostedIn})
          console.log("lol i am here heheheh")
          if(name)
          {
            console.log(name["Name"])
            ret[i] = { ...ret[i], "PostedName": name["Name"] };
            console.log(ret[i])
          }
          const retut=await SubGreddiit.find({Id:ret[i].PostedIn,BlockedUsers:ret[i].PostedBy})
          console.log(retut)
          if(retut.length>0)
          {
              ret[i].PostedBy="BlockedUser"
          }
          }
        }
        ret=ret.filter(i=>i!="-1")

        res.json(ret)
        console.log("lmao")
        console.log(ret)
        console.log(ret)
        return 
      }
      catch(e)
      {
        res.send({"message":"eror"})
        return 
      }
    }
    })
})

app.post('/removeSavedPost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        console.log(cur)
        cur=cur['SavedPosts']
        console.log("here")
        if(cur==undefined || cur==null )
        {
          console.log("hh")
          cur=[]
        }
        cur=cur.filter(i=>i!=req.body["del"])
        console.log(cur)
        try{
          const r=await User.updateOne({username:verifiedJwt['username']},{"$set":{"SavedPosts":cur}})
          console.log(r)
          res.send(cur)
        }
        catch(e)
        {
          console.log(e)
          res.send({"message":"errore"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

app.post('/savePost',async function(req,res)
{
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
    console.log(err)
      res.send({message:"error"})
      console.log(err)
      return
    }else{
      console.log(verifiedJwt)
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        console.log(cur)
        cur=cur['SavedPosts']
        console.log("here")
        if(cur==undefined || cur==null )
        {
          console.log("hh")
          cur=[]
        }
        cur.push(req.body['new'])
        console.log("lmao")
        console.log(cur)
        try{
          console.log(cur)
          console.log(req.body.new)
          const r=await User.updateOne({username:verifiedJwt['username']},{"$addToSet":{"SavedPosts":req.body['new']}})
          console.log(r)
          res.send(cur)
        }
        catch(e)
        {
          console.log(e)
          res.send({"message":"errore"})
        }
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/image', upload.single('file'), function (req, res) {
  console.log(req.file.path)
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString('base64');
  var final_img = encode_img
 /*const new_post=new Post({Img:final_img},function(err,result){
      if(err){
        console.log("here")

          console.log(err);
          res.send({"message":"error"})
      }else{

          console.log(result.img.Buffer);
          console.log("Saved To database");
          res.contentType(final_img.contentType);
          res.send(final_img.image);
      }
  })*/
  const new_post=new Post({Img:final_img,Id:"shivem"});
  new_post.save(function (err, doc) {
       console.log(doc._id);
   });
})

app.post('/getImage',  async function (req, res) {
  try{
    var post = await Post.find({Id:"shivem"})
    res.send(post)
  }
  catch(e)
  {
    console.log(e)
    res.send({"message":"error"})
  }
})

app.post('/getProfileImage',  async function (req, res) {
  const token  = req.body['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      try{
        console.log(verifiedJwt['username'])
        var cur = await User.findOne({username:verifiedJwt['username']});
        cur=cur['ProfilePic']
        res.send({"message":cur})
      }
      catch(e)
      {
        res.send({"message":"eror"})
      }
    }
    })}
)

//, upload.single('file'),
app.post('/uploadProfileImage',function (req, res) {
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      var final_img = req.body["data"]    
      const ret=await User.updateOne({username:verifiedJwt["username"]},{"$set":{"ProfilePic":final_img}})
      res.send({"message":"sucess"})
    }})
})

app.post('/getMessage',async function (req, res) {
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      try
      {
          const time=new Date()
          var cur=await Message.findOne({Id:verifiedJwt["username"],OtherId:req.body['OtherId']});
          if(cur && cur["Data"])
          {
              res.send({message:cur['Data']})
          }
          else 
          {
              res.send({"message":[]})
          }
          }
          catch(e)
          {
            console.log(e)
            res.send({"message":"error"})
          }
    }})
})



app.post('/sendMessage',async function (req, res) {
  const token  = req['body']['jwt']
  jwt.verify(token,process.env.SECRET,async (err, verifiedJwt) => {
  if(err){
      console.log(err)
      res.send({message:"error"})
      return
    }else{
      try
      {
          const time=new Date()
          var cur=await Message.findOne({Id:verifiedJwt["username"],OtherId:req.body['OtherId']});
          if(cur && cur["Data"])
          {
              var current= (cur['Data'])
              current.push({Message:req.body["message"],Epoch:time,type:0})
              console.log(current)
              const ret=await Message.updateOne({Id:verifiedJwt["username"],OtherId:req.body["OtherId"]},{"$set":{"Data":current}})
              console.log(ret)
              cur=await Message.findOne({OtherId:verifiedJwt["username"],Id:req.body['OtherId']});
              current= (cur['Data'])
              //console.log(current)
              current.push({Message:req.body["message"],Epoch:time,type:1})
              await Message.updateOne({Id:req.body['OtherId'],OtherId:verifiedJwt["username"]},{"$set":{"Data":current}})
              res.send({"message":"success"})
          }
          else 
          {
              var data=[]
              data.push({Message:req.body["message"],Epoch:time,type:0})
              console.log(req.body['OtherId'])
              const new_message=new Message({Id:verifiedJwt["username"],OtherId:req.body["OtherId"],Data:data});
              console.log(new_message)
               await new_message.save()
              //await Message.updateOne({Id:verifiedJwt["username"]},{$set:{Data:(data)}})
              data[0].type=1
              const new_message_=new Message({OtherId:verifiedJwt["username"],Id:req.body["OtherId"],Data:data})
              console.log(new_message_)
              await new_message_.save()
             // await Message.updateOne({Id:req.body["OtherId"]},{$set:{Data:(data)}})
              console.log("here")
              res.send({"message":"sucess"})
          }
          }
          catch(e)
          {
            console.log(e)
            console.log("E")
            res.send({"message":"error"})
          }
    }})
})


app.post('/register',async function(req,res){
  console.log(req.body);
  if(!req.body.username || !req.body.password || !req.body.email )
  {
    res.send({"err":"username,password or email can't be empty"})
    return 
  }
   
  const username_ = await User.findOne({username:req.body.username})
  const email_ = await User.findOne({email:req.body.email})
  console.log(username_)
  console.log(email_)
  if(username_ || email_)
  {
      res.send({"err":"username or email already taken"})
      return 
  }
  if(req.body.contact)
  {

    for(let i=0;i<req.body.contact.length;i++)
    {
      if(!(req.body.contact[i]>='0'  && req.body.contact<='9'))
      {
        res.send({"err":"contact invalid"})
        return

      }
    }
      
  }
  if(req.body.Age)
  {
    for(let i=0;i<req.body.Age.length;i++)
    {
      if(!(req.body.Age[i]>='0'  && req.body.Age<='9'))
      {
        res.send({"err":"Age invalid"})
        return

      }
    }

  }
  req.body.password=await hashPassword(req.body.password)
  const new_user = new User(req.body)
  console.log(new_user)
  new_user.save(function (err, doc) {
   //   console.log(doc._id);
  });
  const token = generateAccessToken({ username: req.body.username });
  console.log(token);
  res.send({"message":token});
});

app.listen(PORT, function () {
    console.log(`Server is running on localhost:${PORT}`);
});
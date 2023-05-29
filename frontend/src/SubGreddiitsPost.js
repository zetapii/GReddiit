import React, { useState} from "react";
import Fuse from 'fuse.js';
import { useEffect } from "react";
import { json, useParams } from "react-router-dom";
import { Popup } from "reactjs-popup";
import { useCookies } from "react-cookie";
import { SettingsBluetoothRounded } from "@material-ui/icons";
 
export const  SpecPost = () => 
{
  const [usercomment, setuserComment] = useState('');
  let { id , id_} = useParams();
  const [cookies, setCookie] = useCookies(['user']);
  const [comments,setComments] = useState([])
  const [ok,setok] = useState("yes")
  useEffect(
    ()=>{
   const f= async()=>
   {
     var final;
        try {
          const response = await fetch(`/api/getSpecificPost`, {
          method: 'POST',
          body: JSON.stringify({jwt:cookies["jwt"],Id:id_}),
          headers: { 'Content-Type': 'application/json' },
      });

      if(ok=="no")
      {
       const response2 = await fetch('/api/addCommentPost', {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt'],Id:id_,comment:usercomment}),
        headers: { 'Content-Type': 'application/json' },
        })
        setok("yes")
        window.location.reload()
      }

      const responsee=await response.json();

      if(JSON.stringify(comments)!=JSON.stringify(responsee["message"]))
      {
        setComments(responsee["message"])
      }
  
  }
   catch(e)
   {
    //alert(e)
   }
  }
  f()
}, [comments,ok])
 async function handleComment(event) {
  //event.preventDefault();
  setok("no")
 }
  

return (
  <div>
<div style={{ background: "#f2f2f2", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}> 
</div>
<div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
    <img src="https://i.pinimg.com/236x/be/66/0f/be660f48dd53e5f6c194c857c79ea90a--manga-boy-manga-anime.jpg" alt="User profile" style={{ borderRadius: "50%", marginRight: "10px" ,width:"50px", height:"50px" }} />
  </div>
  <p>{comments["Text"]}</p>
  <hr style={{ margin: "20px 0" }} />
  <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
    <img src="https://wallpapers.com/images/hd/my-hero-academia-cool-anime-55d6bupcaomqldql.jpg" alt="User profile" style={{ borderRadius: "50%", marginRight: "10px",width:"50px",height:"50px" }} />
    <input type="text" placeholder="Write a comment..." style={{ flex: "1", padding: "10px", borderRadius: "20px", border: "1px solid #ccc" }} value={usercomment} onChange={(e) => setuserComment(e.target.value)} />
    <button style={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "20px", padding: "5px 10px", marginLeft: "10px" }} onClick={e => handleComment(e)} >Post</button>
  </div>
  <hr style={{ margin: "20px 0" }} />
  {
  comments["Comments"] && comments["Comments"].length > 0 ? (
    <>
      <h4 style={{ marginBottom: "20px" }}>Comments ({comments["Comments"].length})</h4>
      {comments["Comments"].map((comment, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <img src="https://wallpaper.dog/large/20578114.jpg" alt="User profile" style={{ borderRadius: "50%", marginRight: "10px", height:"50px",width:"50px" }} />
      <div style={{ display: "flex", flexDirection: "column" }}>
      <h5 style={{ margin: "0" }}>Anonymous</h5>
      <p style={{ margin: "0", marginBottom: "10px" }}>{comment}</p>
      <div style={{ display: "flex", alignItems: "center" }}>
      </div>
      </div>
      </div>
      ))}
      </>
      ) : (
      <p>No comments yet.</p>)}
</div>
</div>)
}
export  const PostPage = () => {
    let { id } = useParams();
    const [cookies, setCookie] = useCookies(['user']);
    const f = async ()=>
    {
      if(!cookies["jwt"])
        window.location="/"
      try {
        const response = await fetch(`/api/verify`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      if(responsee["message"]=="error")
      {
          window.location="/"
      }
      }
      catch(e)
      {
        console.log(e)
      }
      try {
        const response = await fetch(`/api/checkJoined`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],Id:id}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      if(responsee["message"]=="error")
      {
          window.location="/"
      }
      }
      catch(e)
      {
        console.log(e)
      }
    }
    f()
    const [det,setdet]=useState({})

    const [Name,setName]=useState('');
    const [Posts,setPosts]=useState([])
    const [BannedKeywords,setBannedKeywords] = useState([])
     var listItems
    useEffect(
       ()=>{
        //
      const f= async()=>
      {
       // alert("here")
        var final;
        try {
          const response = await fetch(`/api/getAllPost`, {
          method: 'POST',
          body: JSON.stringify({jwt:cookies["jwt"],PostedIn:id}),
          headers: { 'Content-Type': 'application/json' },
      });
      const responsee=await response.json();
      final=responsee
     // alert(responsee)
      const lol=Posts
     //alert(lol[0])
     //alert(Posts[0])
     // alert(lol===responsee)
      if(JSON.stringify(lol)!=JSON.stringify(responsee))
      {
       //  alert("changing")
         setPosts(responsee);
         return 
      }
      
          }
            catch(e)
            {
              console.log(e)
            }
          }
          f()
            
      }, [Posts])
    
      useEffect( async() => {

        try {
          const response = await fetch(`/api/getBannedKeywords`, {
          method: 'POST',
          body: JSON.stringify({jwt:cookies["jwt"],PostedIn:id}),
          headers: { 'Content-Type': 'application/json' },
      });

        
        const responsee=await response.json();
        responsee["more"].len=0
        try
        {
          responsee["more"].len=responsee["more"].Followers.length

        }
        catch(e)
        {

        }
        //alert(JSON.stringify(responsee))
        
        setBannedKeywords(responsee["message"])
        // alert(responsee["more"])
        setdet(responsee["more"])
        
    }
        catch(e)
        {
          console.log(e)
        }

      },[]);

      
    async function handleSubmitSavePost(e)
    {
      if(e==null || e==undefined)
      {

        return ;
      }
      try {
        const response = await fetch(`/api/savePost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],new:e}),
        headers: { 'Content-Type': 'application/json' },
    });
    alert("Post Saved")
    }
    catch(e)
    {
      alert(e)
    }
    }
      
    async function handleSubmitReport(e,item)
    {
      if(e==null || e==undefined)
      {

        return ;
      }
      try {

        alert("reporting post")
        const response = await fetch(`/api/reportPost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],Id:e,ReportedPerson:item["PostedBy"],Concern:"spam",SubGreddiitId:id,Text:item["Text"]}),
        headers: { 'Content-Type': 'application/json' },
    });
    const responsee = await response.json()
    if(responsee["message"]=="moderator can't be reported") 
    {
      alert("moderator can't be reported")
    }
    else if(responsee["message"]=="user already blocked")
    {
      alert("user is already blocked")
    }
    else 
    {
      alert("Post Reported")
     // window.location.reload()
    }
    }
    catch(e)
    {
      alert(e)
    }
    }
    async function handleSubmitFollow(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      try {
        const response = await fetch(`/api/addFollowing`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],new:e}),
        headers: { 'Content-Type': 'application/json' },
    });
    const responsee = await response.json()
    // alert(JSON.stringify(responsee))
    if(responsee["message"]=="can't follow self")
    {
      alert("cant follow self")
    }
    }
    catch(e)
    {
      alert(e)
    }
    }
    async function handleComment(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      window.location="/SubGreddiits/"+String(id)+"/Post/"+String(e)
    }
    async function upvotePost(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
     // alert(e)
      try {
        const response = await fetch(`/api/UpvotePost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],Id:e}),
        headers: { 'Content-Type': 'application/json' },
        });
        let responsee=await response.json();
        if(responsee["message"]=="already")
        {
          alert("already upvoted/downvoted")
        }
    }
      
    catch(e)
    {
      alert(e)
    }
    const ret=structuredClone(Posts)
    for(let i=0;i<ret.length;i++)
    {
      if(ret[i]['Id']==e)
      {
       // alert(ret[i]['Upvotes'])
        ret[i]['Upvotes']=ret[i]['Upvotes']+1
       // alert(ret[i]['Upvotes'])

      }
    }
    setPosts(ret)
  
    }
    async function downvotePost(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      try {
        const response = await fetch(`/api/DownvotePost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],Id:e}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      if(responsee["message"]=="already")
      {
        alert("already upvoted/downvoted")
      }
      }
      catch(e)
      {
        alert(e)
      }
      const ret=structuredClone(Posts)
      for(let i=0;i<ret.length;i++)
      {
        if(ret[i]['Id']==e)
        {
         // alert(ret[i]['Upvotes'])
          ret[i]['Donwvotes']=ret[i]['Downvotes']+1
         // alert(ret[i]['Upvotes'])
  
        }
      }
      setPosts(ret)
    }
    async function handleSubmitFollow(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      alert(e)
      try {
        const response = await fetch(`/api/addFollowing`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],new:e}),
        headers: { 'Content-Type': 'application/json' },
      });

    const responsee = await response.json()
    if(responsee["message"]=="can't follow self")
    {
      alert("cant follow self")
    }
    }
    catch(e)
    {
      alert(e)
    }
    }
    async function handleSubmitNewSubmit()
    {
      if(Name.length==0)
      {
        alert("Empty Post")
        return
      }
      const checking=Name.split(" ")
      for(let i=0;i<checking.length;i++)
      {
        for(let j=0;j<BannedKeywords.length;j++)
        {
          //console.log(checking[i])
            if(JSON.stringify(checking[i])==JSON.stringify(BannedKeywords[j]))
            {
                alert("Post contains Banned Keywords")
            }
        }
      }
      try {
          const response = await fetch(`/api/createPost`, {
          method: 'POST',
          body: JSON.stringify({jwt:cookies["jwt"],PostedIn:id,Text:Name}),
          headers: { 'Content-Type': 'application/json' },
          });
          let responsee = await response.json();
        //  alert(JSON.stringify(responsee))
          // if(JSON.stringify(responsee["message"])===JSON.stringify("banned"))
          // {
          //   alert("Post Contains Blocked Keywords");
          // }

      }
      catch(e)
      {
        alert(e)
      }
      // window.location.reload()
    }


const [popupOpen, setPopupOpen] = useState(false);

const openPopup = () => setPopupOpen(true);
const closePopup = () => setPopupOpen(false);
const [showPopup, setShowPopup] = useState(false);
 
const [showPopupp, setShowPopupp] = useState(false);
  const [concern, setConcern] = useState("");

    

return (
  <div>

  <div style={{ background: "#f2f2f2", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
  {det["Image"] ? (
          <img src={`data:image/png;base64,${det["Image"]}`} width="200" height="200" />
      ) : (
        <img src="https://via.placeholder.com/150x150.png?text=Dummy+Image" alt="Dummy Image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
      )}

  <h1 style={{ marginBottom: "20px" , borderRadius: "10px",color:"green"}}>Subgreddiit-Name : {det.Name}</h1>
  <h1 style={{ marginBottom: "20px" ,  borderRadius: "10px",color:"pink"}}>Banned-Keywords : {det.BannedKeywords+","}</h1>
  <h1 style={{ marginBottom: "20px" ,  borderRadius: "10px",color:"pink"}}>Description : {det.Description}</h1>
   <h1 style={{ marginBottom: "20px" ,  borderRadius: "10px",color:"pink"}}>Number of People : {det.len}</h1> 


</div>

  <div style={{ background: "#f2f2f2", padding: "20px" }}>
   <button 
  style={{ 
    padding: '10px 20px', 
    backgroundColor: '#007bff', 
    color: 'white', 
    borderRadius: '5px', 
    border: 'none',
    marginLeft: 'auto',
    boxShadow: '0px 0px 10px rgba(0,0,0,0.3)',
    fontWeight: 'bold',
    fontSize: '16px'
  }}
  onClick={openPopup}
>
  Create New
</button>

        {popupOpen && (
          <div style={{ 
            position: 'fixed', 
            top: '0', 
            left: '0', 
            right: '0', 
            bottom: '0', 
            backgroundColor: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '20px', 
              borderRadius: '10px', 
              boxShadow: '0px 0px 10px gray' 
            }}>
              <form style={{ width: '80%' }}>
  <div style={{ marginTop: '20px' }}>
    <label htmlFor="post" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Create a post:</label>
    <textarea 
      id="post" 
      name="post" 
      value={Name} 
      onChange={e=>setName(e.target.value)} 
      style={{ padding: '10px', fontSize: '14px', width: '250px', height: '100px' }}
    />
  </div>

  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
    <button 
      style={{ 
        padding: '10px 20px', 
        backgroundColor: '#007bff', 
        color: 'white', 
        borderRadius: '5px', 
        border: 'none',
        marginLeft: 'auto' 
      }}
      onClick={handleSubmitNewSubmit}
    >
      Post
    </button>
    <button 
      style={{ 
        padding: '10px 20px', 
        backgroundColor: '#aaa', 
        color: 'white', 
        borderRadius: '5px', 
        border: 'none',
        marginLeft: '10px' 
      }}
      onClick={closePopup}
    >
      Cancel
    </button>
  </div>
</form>


             
            </div>
            
          </div>
        )}
        <div>

        </div>
        <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
      {Posts.map((item, index) => (
        <div key={index} style={{ background: "#f2f2f2", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
        <h2 style={{ marginBottom: "20px" }}>{item["Text"]}</h2>
        <p style={{ marginBottom: "10px" }}>Posted by: {item["PostedBy"]}</p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <p style={{ margin: "0", marginRight: "20px" }}>Upvotes: {item["Upvotes"]}</p>
          <p style={{ margin: "0" }}>Downvotes: {item["Downvotes"]}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={e => upvotePost(item["Id"])} style={{ background: "green", color: "white", padding: "10px", marginRight: "10px" }}>Upvote</button>
          <button onClick={e => downvotePost(item["Id"])} style={{ background: "red", color: "white", padding: "10px", marginRight: "10px" }}>Downvote</button>
          <button onClick={e => handleSubmitFollow(item["PostedBy"])} style={{ background: "blue", color: "white", padding: "10px", marginRight: "10px" }}>Follow User</button>
          <button onClick={e => handleSubmitSavePost(item["Id"])} style={{ background: "orange", color: "white", padding: "10px",marginRight:"10px" }}>Save Post</button>
          <button onClick={e => handleSubmitReport(item["Id"],item)} style={{ background: "red", color: "white", padding: "10px" }}>Report</button>
      <div>
          <button onClick={e => handleComment(item["Id"],item)} style={{ background: "red", color: "white", padding: "10px" }}>Comment</button>
        </div>
        </div>
      </div>
      
      ))
      }
    </div>
  </div>
  </div>
);    
};
























export  const SavedPostPage = () => {
    let { id } = useParams();
    const [cookies, setCookie] = useCookies(['user']);
    const [Name,setName]=useState('');
    const [Posts,setPosts]=useState([])
    const f = async ()=>
    {
      if(!cookies["jwt"])
        window.location="/"
      try {
        const response = await fetch(`/api/verify`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      if(responsee["message"]=="error")
      {
          window.location="/"
      }
      }
      catch(e)
      {
        console.log(e)
      }
    }
    f()
      useEffect(
        ()=>{
         //
       const ff= async()=>
       {
         var final;
         try {
           const response = await fetch(`/api/getSavedPost`, {
           method: 'POST',
           body: JSON.stringify({jwt:cookies["jwt"]}),
           headers: { 'Content-Type': 'application/json' },
       });
      //  alert(JSON.stringify(response))
       const responsee=await response.json();
       final=responsee
        // alert(JSON.stringify(responsee))
       const lol=Posts
       console.log(JSON.stringify(responsee))
       console.log(JSON.stringify(lol))
 
      //alert(lol[0])
      //alert(Posts[0])
      // alert(lol===responsee)
       if(JSON.stringify(lol)!=JSON.stringify(responsee))
       {
        //  alert("changing")
          setPosts(responsee);
          return 
       }
       
           }
             catch(e)
             {
               console.log(e)
             }
           }
           ff()
             
       }, [Posts])
    function handleSubmit()
    {
     //   setPosts([...Posts,{text: Name}]);
        setName('');
    }
    async function handleSubmitFollow(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
    //  alert(e)
      try {
        const response = await fetch(`/api/addFollowing`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],new:e}),
        headers: { 'Content-Type': 'application/json' },
    });
    }
    catch(e)
    {
//      alert(e)
    }
    window.location.reload()
    }
    async function upvotePost(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
    //  alert(e)
      try {
        const response = await fetch(`/api/UpvotePost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],Id:e}),
        headers: { 'Content-Type': 'application/json' },
        });
        let responsee=await response.json();
        if(responsee["message"]=="error")
        {
          alert("already upvoted/downvoted")
        }
    }
    catch(e)
    {
      alert(e)
    }
    const ret=structuredClone(Posts)
    for(let i=0;i<ret.length;i++)
    {
      if(ret[i]['Id']==e)
      {
       // alert(ret[i]['Upvotes'])
        ret[i]['Upvotes']=ret[i]['Upvotes']+1
       // alert(ret[i]['Upvotes'])

      }
    }
    setPosts(ret)
    //window.location.reload()
    }
    async function downvotePost(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      //alert(e)
      try {
        const response = await fetch(`/api/DownvotePost`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],Id:e}),
        headers: { 'Content-Type': 'application/json' },
    });
    }
    catch(e)
    {
      alert(e)
    }
    }
    async function handleSubmitFollow(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
      alert(e)
      try {
        const response = await fetch(`/api/addFollowing`, {
        method: 'POST',
        body: JSON.stringify({jwt:cookies["jwt"],new:e}),
        headers: { 'Content-Type': 'application/json' },
    });
    }
    catch(e)
    {
      alert(e)
    }
    }
    async function removeSaved(e)
    {
      if(e==null || e==undefined)
      {
        return ;
      }
                try {
          const response = await fetch(`/api/removeSavedPost`, {
          method: 'POST',
          body: JSON.stringify({jwt:cookies["jwt"],del:e}),
          headers: { 'Content-Type': 'application/json' },
      });
      }
      catch(e)
      {
        alert(e)
      }
      
    const ret=[]
    for(let i=0;i<Posts.length;i++)
    {
      if(Posts[i]['Id']!=e)
      {
        ret.push(Posts[i])
      }
    }
    console.log(ret)
    setPosts(ret)
      //window.location.reload()
    }
   

      
      return (
        <div style={{ background: "#f2f2f2", padding: "20px" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "10px" }}>
            {Posts.map((item, index) => (
              <div key={index} style={{ background: "#f2f2f2", padding: "20px", marginBottom: "20px", borderRadius: "10px" }}>
                <h2 style={{ marginBottom: "20px" }}>{item["Text"]}</h2>
                <p style={{ marginBottom: "10px" }}>Posted by: {item["PostedBy"]}</p>
                <p style={{ marginBottom: "10px" }}>Posted in: {item["PostedName"]}</p>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p style={{ margin: "0", marginRight: "20px" }}>Upvotes: {item["Upvotes"]}</p>
              <p style={{ margin: "0" }}>Downvotes: {item["Downvotes"]}</p>
            </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={e => upvotePost(item["Id"])} style={{ background: "green", color: "white", padding: "10px", marginRight: "10px" }}>Upvote</button>
                  <button onClick={e => downvotePost(item["Id"])} style={{ background: "red", color: "white", padding: "10px", marginRight: "10px" }}>Downvote</button>
                  <button onClick={e => removeSaved(item["Id"])} style={{ background: "orange", color: "white", padding: "10px" }}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      
};

export default PostPage;
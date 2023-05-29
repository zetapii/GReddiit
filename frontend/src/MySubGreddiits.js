import React, { Component } from 'react';    
import Popup from 'reactjs-popup';
import "react-table-v6/react-table.css";  
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import { useState,useEffect } from 'react';
import { useNavigate, redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { findAllInRenderedTree } from 'react-dom/test-utils';

import verify from './auth';
import { RepeatOneSharp } from '@material-ui/icons';

export function ShowUsersRequests()
{
  const { id } = useParams();
  const Id=id
  const [subInfo,setsubInfo]=useState([])
  const [cookies, setCookie] = useCookies(['user']);
  const upd=useEffect(async ()=>{
    try {
      const response = await fetch(`/api/getSubGreddiitRequests`, {
      method: 'POST',
      body : JSON.stringify({jwt:cookies['jwt'],Id:Id}),
      headers: { 'Content-Type': 'application/json' },
      });
      const responsee= await response.json()
      setsubInfo(responsee["message"])
    }
  catch(e)
  {
      console.log(e)
  }
        try {
          const response = await fetch(`/api/verifyPerm`, {
          method: 'POST',
          body : JSON.stringify({jwt:cookies['jwt'],Id:Id}),
          headers: { 'Content-Type': 'application/json' },
          });
          const responsee= await response.json()
          if(responsee["message"]=="error")
          { 
            window.location="/"
          }
        }
      catch(e)
      {
          console.log(e)
      }

},
   []) 
    
   async function handleSubmitAccept(user)
   {
      try {
        const response = await fetch(`/api/creatSubGreddiitUsers`, {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt'],Id:Id,new:user}),
        headers: { 'Content-Type': 'application/json' },
        });
        const responsee= await response.json()
        setsubInfo(responsee)
      }
      catch(e)
      {
            console.log(e)
      }    
      window.location.reload()
   } 
   async function handleSubmitReject(user)
   {
    try {
      const response = await fetch(`/api/rejectSubGreddiitRequest`, {
      method: 'POST',
      body : JSON.stringify({jwt:cookies['jwt'],Id:Id,del:user}),
      headers: { 'Content-Type': 'application/json' },
      });
      const responsee= await response.json()
      setsubInfo(responsee)
    }
    catch(e)
    {
          console.log(e)
    }    
    window.location.reload()
   }
  
   const userInfo = subInfo.map((item, index) => (
    <li key={index} style={{marginBottom: "10px"}}>
        <div style={{display: "flex", alignItems: "center"}}>
            <span style={{marginRight: "10px"}}>{item}</span>
            <button onClick={e=>handleSubmitAccept(item)} style={{backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px"}}>
                Accept
            </button>
            <button onClick={e=>handleSubmitReject(item)} style={{backgroundColor: "#dc3545", color: "white", border: "none", padding: "5px 10px", borderRadius: "3px", marginLeft: "10px"}}>
                Reject
            </button>
        </div>
    </li>
));
return (
  <div>
        <h2 align="center">Follower Requests</h2>

  <div style={{border: '1px solid #ccc', padding: '10px'}}>
    <ol>
      {userInfo}
    </ol>
  </div>
  </div>

);
}

export function ShowUsers()
{
  const { id } = useParams();
  const Id=id
  const [subInfo,setsubInfo]=useState([])
  const [blocked,setBlocked]=useState([])
  const [cookies, setCookie] = useCookies(['user']);
  useEffect( ()=>{
    const f=async ()=>
    {
    try {
      const response = await fetch(`/api/getMySubGreddiitsUsersInfo`, {
      method: 'POST',
      body : JSON.stringify({jwt:cookies['jwt'],Id:Id}),
      headers: { 'Content-Type': 'application/json' }
      });
      console.log(response)
      var responsee=await response.json()
      console.log(responsee["message"]);
      //Array.prototype.push.apply(responsee[""])
      responsee["message"]=responsee["message"].map((i)=>{return {data:i,type:0}})
      responsee["blocked"]=responsee["blocked"].map((i)=>{return {data:i,type:1}})
    //  alert(JSON.stringify(responsee["message"]))
      responsee["message"]=responsee["message"].concat(responsee["blocked"])
      //  alert(JSON.stringify(responsee))
      setsubInfo(responsee["message"]);
      
      //setsubInfo({...subInfo,responsee["blocked"]})
    }
  catch(e)
  {
      console.log(e)
  }    
  try {
    const response = await fetch(`/api/verifyPerm`, {
    method: 'POST',
    body : JSON.stringify({jwt:cookies['jwt'],Id:Id}),
    headers: { 'Content-Type': 'application/json' },
    });
    const responsee= await response.json()
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
},
   []) 
   
  const userInfo = subInfo.map((item, index) => (
    <li key={index}>
     Username : {item}
    </li> ))
    return (
      <div>
  <h2 style={{ color: "blue", textAlign: "center" }}>Followers</h2>
  <ol style={{ listStyleType: "decimal",marginLeft:"4px" }}>
    {subInfo.map((user, index) => (

<li key={index} style={{ 
  background: user.type === 0 ? "#f4f4f4" : "red", 
  padding: "10px", 
  margin: "5px 0" 
}}>
  {user.data}
</li>
    ))}
  </ol>

</div>
    )

}

export function ShowReportedPages()
{
  const { id } = useParams();
  const Id=id
  const [subInfo,setsubInfo]=useState([])
  const [cookies, setCookie] = useCookies(['user']);
  const [ignoredReports, setIgnoredReports] = useState([]);
  const [blockedReports, setBlockedReports] = useState([]);

  const [blocking, setBlocking] = useState(false);
  const [cancelBlock, setCancelBlock] = useState(false);

  const [countdown, setCountdown] = useState(3);
  useEffect( ()=>{
  //  alert("hey")
     const f=async()=>
     {
    //  alert("lol")
    try {
      const response = await fetch(`/api/getReportedPost`, {
      method: 'POST',
      body : JSON.stringify({jwt:cookies['jwt'],SubGreddiitId:Id}),
      headers: { 'Content-Type': 'application/json' }
      });
      console.log(response)
      const responsee=await response.json()
      console.log(responsee["message"]);
   //  // alert(JSON.stringify(responsee["message"]))
  //    alert(JSON.stringify(subInfo))
      if(JSON.stringify(responsee["message"])!==JSON.stringify(subInfo))
        setsubInfo(responsee["message"]);
    }
  catch(e)
  {
      console.log(e)
  }
  try {
    const response = await fetch(`/api/verifyPerm`, {
    method: 'POST',
    body : JSON.stringify({jwt:cookies['jwt'],Id:Id}),
    headers: { 'Content-Type': 'application/json' },
    });
    const responsee= await response.json()
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

},
   [subInfo]) 
  async function ignoreReport(item)
  {
    try {
      const response = await fetch(`/api/removeReport`, {
      method: 'POST',
      body : JSON.stringify({...item,jwt:cookies['jwt'],SubGreddiitId:id}),
      headers: { 'Content-Type': 'application/json' }
      });
      console.log(response)
      const responsee=await response.json()
      console.log(responsee["message"]);
     // alert(JSON.stringify(responsee["message"]))
      ///setsubInfo(responsee["message"]);
    }
    catch(e)
    {
        console.log(e)
    }    
  }
  async function blockUserReport(item)
  {
    console.log("removing report")
    console.log(item)
    try {
      const response = await fetch(`/api/blockUserSubGreddiit`, {
      method: 'POST',
      body : JSON.stringify({...item,jwt:cookies['jwt'],SubGreddiitId:id}),
      headers: { 'Content-Type': 'application/json' }
      });
      console.log(response)
      const responsee=await response.json()
      console.log(responsee["message"]);
      setsubInfo(responsee["message"]);
    }
    catch(e)
    {
        console.log(e)
    }    
  }
  async function deleteUserReport(item)
  {
    console.log("removing report")
    console.log(item)
    try {
      const response = await fetch(`/api/deleteReportPost`, {
      method: 'POST',
      body : JSON.stringify({...item,jwt:cookies['jwt'],SubGreddiitId:id}),
      headers: { 'Content-Type': 'application/json' }
      });
      console.log(response)
      const responsee=await response.json()
      console.log(responsee["message"]);
    //  alert(JSON.stringify(responsee["message"]))
      setsubInfo(responsee["message"]);
    }
    catch(e)
    {
        console.log(e)
    }    
  }
    
  const tableStyle = {
      borderCollapse: "collapse",
      width: "100%",
    };
    const thStyle = {
      backgroundColor: "#f2f2f2",
      borderBottom: "1px solid #ddd",
      fontWeight: "bold",
      padding: "8px",
      textAlign: "left",
      verticalAlign: "top",
    };
    const tdStyle = {
      borderBottom: "1px solid #ddd",
      padding: "8px",
      textAlign: "left",
      verticalAlign: "top",
    };
    const ignoredStyle = {
      opacity: 0.5,
    };
    const [ign,setign]=useState([])

    const handleIgnoreClick = (item) => {
      setIgnoredReports([...ignoredReports, item]);
      setign(...ign,item)
      ignoreReport(item);
      window.location.reload()
    };
    var countdownInterval;
    const handleBlockUserClick = (item) => {

    };
    const handleCancelBlockClick = () => {
      // alert("shouldn't be here")
      setBlocking(false);
      clearInterval(countdownInterval);
      setCancelBlock(true);
      alert(countdown)
    };

  
    const handleDeletePostClick = (item) => {
      deleteUserReport(item);
    };
  
    useEffect(() => {
      if (countdown === 0) {
        alert("lmao reached here")
        setCancelBlock(false);
      }
    }, [countdown]);
  
    const userInfo = subInfo.map((item, index) => {
      const isIgnored = ignoredReports.includes(item);
      return (
        <tr key={index} style={isIgnored ? ignoredStyle : {}}>
          <td style={tdStyle}> {item["Concern"]}</td>
          <td style={tdStyle}>{item["Text"]}</td>
          <td style={tdStyle}>{item["ReportedBy"]}</td>
          <button onClick={() => handleIgnoreClick(item)}>Ignore</button>
          <button onClick={() => blockUserReport(item)}>Block User</button>
          <button onClick={() => handleDeletePostClick(item)} >Delete Post</button>
        </tr>
      );
    });
  
    return (
      <div>
        <h2 align="center">Reported Pages 
</h2>
        <br />
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Concern</th>
              <th style={thStyle}>Text</th>
              <th style={thStyle}>Reported By</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>{userInfo}</tbody>
        </table>
      </div>
    );
  
}

export function CreateMySubGreddiits() {
    const [Name, setName] = useState('');
    const [Description, setDescription] = useState('');
    const [Tags, setTags] = useState('');
    const [BannedKeywords , setBannedKeywords] = useState('');
    const [cookies, setCookie] = useCookies(['user']);
    const [subInfo,setsubInfo]=useState([])
    const [image, setImage] = useState({ preview: '', data: '' })
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
     // alert(responsee["message"])
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

    const [data,setData] = useState(null)
    const upd=useEffect(async ()=>{
      try {
        const response = await fetch(`/api/getMySubGreddiitsInfo`, {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
        });
        const responsee= await response.json()
        setsubInfo(responsee)
      }
    catch(e)
    {
        console.log(e)
    }
  

  
  },
     []) 

    const navigate=useNavigate();
    function handleSubmitUrl (event) {
        const res="/SubGreddiits/moderator/"+(event);
        navigate(res)
        window.location.reload(false);
    };
    async function handleSubmitUrlDelete (  event) {
      try{
      const response =  await fetch(`/api/deleteMySubGreddiitsInfo`, {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt'],Id:event}),
        headers: { 'Content-Type': 'application/json' },
        });
        window.location.reload()

        const responsee= await response.json()
        try {
          const response = await fetch(`/api/getMySubGreddiitsInfo`, {
          method: 'POST',
          body : JSON.stringify({jwt:cookies['jwt']}),
          headers: { 'Content-Type': 'application/json' },
          });
          const responsee= await response.json()
          setsubInfo(responsee)
        }
        catch(e)
          {
              console.log(e)
          }    
          }
      catch(e)
      {
          console.log(e)
      }
  };
  async function handleSubmit (event) {
      if(Name.length==0)
      {
        alert("Empty Name")
        return
      }
      
         event.preventDefault();
         async function call(imageBase64)
         {       
          var bod 
          if(!imageBase64)
         {
          bod=JSON.stringify({jwt:cookies['jwt'],Name:Name,Description:Description,Tags:Tags,BannedKeywords:BannedKeywords,Followers:1})
         }
         else 
         {
          bod=JSON.stringify({jwt:cookies['jwt'],Name:Name,Description:Description,Tags:Tags,BannedKeywords:BannedKeywords,Followers:1,img:imageBase64})
         }
           try {
               const response = await fetch('/api/creatSubGreddiit', {
               method: 'POST',
               body : JSON.stringify({jwt:cookies['jwt'],Name:Name,Description:Description,Tags:Tags,BannedKeywords:BannedKeywords,Followers:1,img:imageBase64}),
               headers: { 'Content-Type': 'application/json' },
                });
               console.log(response)
              //  alert(JSON.stringify(response))
               try {
                 const response = await fetch(`/api/getMySubGreddiitsInfo`, {
                 method: 'POST',
                 body : JSON.stringify({jwt:cookies['jwt']}),
                 headers: { 'Content-Type': 'application/json' },
                 });
                 const responsee= await response.json()
                 setsubInfo(responsee)
               }
               catch(e)
               {
                   console.log(e)
               }  
           }
           catch(e)
           {
               console.log("ffknff")
               console.log(e)
               
           }
         }
        console.log(event)
        const imageData = image?.data;
        // alert(imageData);
        let imageBase64 = null;
        if (imageData) {
          // Convert image to base64
          const reader = new FileReader();
          reader.readAsDataURL(imageData);
          reader.onload = () => {
            imageBase64 = reader.result.split(',')[1];
            call(imageBase64)
          };
        }
        else 
        {
          call(imageBase64)
        }
        
   
        //console.log(response);
        //send a login request to the server with the entered username and password
    };
        const listItems = subInfo.map((item, index) => (
          <li key={index} style={{ listStyleType: 'none', padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid lightgray', borderRadius: '10px', padding: '20px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Number of People: {item["Followers"].length}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Number of Posts: {item["count"]}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Name: {item['Name']}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Description: {item['Description']}
              </div>
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                Banned Keywords:  {item['BannedKeywords'].join(', ')}
              </div>
              
              <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
              {item["Image"] ? (
          <img src={`data:image/png;base64,${item["Image"]}`} width="100" height="100" />
      ) : (
        <img src="https://via.placeholder.com/150x150.png?text=Dummy+Image" alt="Dummy Image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
      )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '150px', marginTop: '20px' }}>
                <button 
                  onClick={() => handleSubmitUrl(item['Id'])} 
                  style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '5px', border: 'none' }}
                >
                  Open
                </button>
                <button 
                  onClick={() => handleSubmitUrlDelete(item['Id'])} 
                  style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', borderRadius: '5px', border: 'none' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))
        
        const [showPopup, setShowPopup] = useState(false);

        const openPopup = () => {
          setShowPopup(true);
        }
        
        const closePopup = () => {
          setShowPopup(false);
        }
        const handleFileChange = (e) => {
          const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            data: e.target.files[0],
          }
          setImage(img)
        }
    return  (
      <div>
        <button 
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            borderRadius: '5px', 
            border: 'none',
            marginLeft: 'auto' 
          }}
          onClick={openPopup}
        >
          Create New
        </button>
        {showPopup && (
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
        <label htmlFor="name" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Name:</label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={Name} 
          onChange={e=>setName(e.target.value)} 
          style={{ padding: '10px', fontSize: '14px', width: '250px' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="description" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Description:</label>
        <textarea 
          id="description" 
          name="description" 
          value={Description} 
          onChange={e=>setDescription(e.target.value)} 
          style={{ padding: '10px', fontSize: '14px', width: '250px', height: '100px' }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <label htmlFor="tags" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Tags:</label>
        <input 
          type="text" 
          id="tags" 
          name="tags" 
          value={Tags} 
          onChange={e=>setTags(e.target.value)} 
          style={{ padding: '10px', fontSize: '14px', width: '250px' }}
        />
      </div>
          

      <div style={{ marginTop: '20px' }}>
        <label htmlFor="bannedKeywords" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Banned Keywords:</label>
        <input 
          type="text" 
          id="bannedKeywords" 
          name="bannedKeywords" 
          value={BannedKeywords}
          onChange={e=>setBannedKeywords(e.target.value)}
          style={{ padding: '10px', fontSize: '14px', width: '250px' }}
        />
      </div>
    <label htmlFor="image" style={{ width: '120px', textAlign: 'right', marginRight: '10px' }}>Image:</label>
    <input type='file' name='file' onChange={handleFileChange}></input>
      {image.preview && <img src={image.preview} width='100' height='100' />}

</form>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button style={{ padding: '10px 20px', marginRight: '20px', backgroundColor: 'green', color: 'white' }} onClick={(e)=>{handleSubmit(e);closePopup()}}>Save</button>

        <button style={{ padding: '10px 20px', backgroundColor: 'red', color: 'white' }} onClick={closePopup}>Cancel</button>
      </div>

             
            </div>
          </div>
        )}
        {listItems}
      </div>
    )
    
    
    
  }
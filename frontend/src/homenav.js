import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import verify from './auth';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './homeNavbarElements';
import { Home, LocationOn, Notifications,Facebook } from '@material-ui/icons';
import Link from '@material-ui/core/Link';
import Button from '@mui/material/Button'
import { json, useParams } from "react-router-dom";


export const Navbar =  () =>
{
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
  }
 f()
 
  if(!localStorage.getItem("time")|| localStorage.getItem("time")==0)
  {
    localStorage.setItem("time",1);
    window.location.reload()
  }  
  else if(localStorage.getItem("time")==1)
  {
    localStorage.setItem("time",2)
    window.location.reload()
  }
  else 
  {
    localStorage.clear()
  }
  //          <NavLink to='/userhome' activeStyle>
  //          </NavLink>
//          <Home>
//<Link tp="/userhome" >
//Clik here
//</Link>            
//</Home>


 return (
  <div style={{display: 'flex', flexDirection: 'column',backgroundImage:'url("https://media.licdn.com/dms/image/C5612AQEB5NxC-C6K6w/article-cover_image-shrink_720_1280/0/1604527373476?e=2147483647&v=beta&t=GNiEZKVy7P504VfvEWaYwqW_IL3DraOmgHDYiVlzU2o")',height:"100vh"}}>

  <nav style={{textAlign:"center"}}>
      <Button onClick={()=>window.location="/userhome"} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Profile
      </Button>
      <Button onClick={()=>window.location="/MySubGreddiits"} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        My Sub Greddiits
      </Button>
      <Button onClick={()=>window.location="/SubGreddiits"} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Sub Greddiits
      </Button>
      <Button onClick={()=>window.location="/SavedPosts"} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Saved Posts
      </Button>
      <Button onClick={()=>window.location="/logout"} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Logout
      </Button>
       </nav>
      
       
    </div>
  );

};
  
export const Navbarr = () => {
  
  if(!localStorage.getItem("time")|| localStorage.getItem("time")==0)
  {
    localStorage.setItem("time",1);
    window.location.reload()
  }  
  else if(localStorage.getItem("time")==1)
  {
    localStorage.setItem("time",2)
  }
  else 
  {
    localStorage.clear()
  }
  const [cookies, setCookie] = useCookies(['user']);
  const [det,setdet] = useState({})
  let { id } = useParams();
  verify(cookies,{"perm":id})
  const url = "SubGreddiits/moderator/"
  useEffect(()=>
  {
    const f = async ()=>
    {
    try {
      const response = await fetch(`/api/getBannedKeywords`, {
      method: 'POST',
      body: JSON.stringify({jwt:cookies["jwt"],PostedIn:id}),
      headers: { 'Content-Type': 'application/json' },
  });
  const responsee=await response.json();
  //alert(JSON.stringify(responsee))
  setdet(responsee["more"])

    }
    catch(e)
    {

    }
    }
    f()

  },[])

  return (
    <div style={{display: 'flex', flexDirection: 'column',backgroundImage:'url("https://media.licdn.com/dms/image/C5612AQEB5NxC-C6K6w/article-cover_image-shrink_720_1280/0/1604527373476?e=2147483647&v=beta&t=GNiEZKVy7P504VfvEWaYwqW_IL3DraOmgHDYiVlzU2o")',height:"100vh"}}>
     <nav style={{textAlign:"center"}}>
        <Button onClick={()=>window.location=String(id)+'/Users'} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Users
      </Button>
      <Button onClick={()=>window.location=String(id)+'/JoiningRequestsPage'} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Joining Requests Page
      </Button>
      <Button onClick={()=>window.location=String(id)+'/Stats'} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Stats
      </Button>
      <Button onClick={()=>window.location=String(id)+'/ReportedPage'} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Reported Page
      </Button>
      <Button onClick={()=>window.location='/logout'} style={{color:"red",backgroundColor:"white"}}>
        <Home/>
        Logout
      </Button>
</nav>
{det["Image"] ? (
          <img src={`data:image/png;base64,${det["Image"]}`} width="200" height="200" />
      ) : (
        <img src="https://via.placeholder.com/150x150.png?text=Dummy+Image" alt="Dummy Image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
      )}
<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', marginTop: '20px',color:"white" }}>
<div>

      Subgreddiit Name: {det["Name"]}
      <br></br>
      Subgreddiit Description: {det["Description"]}

    </div>
    <br></br>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '24px', fontWeight: 'bold', marginTop: '20px',color:"white" }}>
    </div>
  
</div>
<div >
 
</div>
</div>
      
    );
  };
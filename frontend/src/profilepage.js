import React, { Component, isValidElement } from 'react';    
import Popup from 'reactjs-popup';
import "react-table-v6/react-table.css";  
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {verify} from './auth.js'
import ReactTimeout from 'react-timeout'
import { useParams } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import { FitnessCenter, Save } from '@material-ui/icons';

const ProfilePage = () => {
  const [cookies, setCookie] = useCookies(['user']);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');
  const [contact, setcontact] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Age, setAge] = useState('');

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
    {
      const response = await fetch(`/api/getUserDetails`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      responsee=responsee[0]
      //alert(JSON.stringify(responsee))
      if(responsee)
      {
        setFirstName(responsee.FirstName)
        setLastName(responsee.LastName)
        setAge(responsee.Age)
        setcontact(responsee.contact)
        setemail(responsee.email)
      }
    }
    }
    catch(e)
    {
      console.log(e)
    }
  }
  // f()


    const [userInfo, setuserInfo] = useState({});
    verify(cookies)

    const dummy=async ( )=>{
      if(userInfo['username']!=undefined)
      {
         console.log(userInfo['username'])
         return ;
      }
    try {
      const response = await fetch(`/api/getUserDetails`, {
      method: 'POST',
      body: JSON.stringify({ jwt:cookies['jwt']}),
      headers: { 'Content-Type': 'application/json' },
    });
    let responsee=await response.json();
    console.log("F")
    console.log(responsee[0])
    setuserInfo(responsee[0])
    console.log(userInfo)
   } catch (err) 
      {
        console.error(err);
      }
    }
    const [followers,setFollowers ] = useState([]);
    const [following,setFollowing ] = useState([]);
    useEffect( ()=>{
       dummy()
       f()
      const g = async ()=>
      {
          try {
            const response = await fetch(`/api/getFollowers`, {
            method: 'POST',
            body : JSON.stringify({jwt:cookies['jwt']}),
            headers: { 'Content-Type': 'application/json' },
            });
            const responsee= await response.json()
            setFollowers(responsee)
          }
        catch(e)
        {
            console.log(e)
        }
      }
      g()
  } ,[] 
    )
    useEffect(async ()=>{
      try {
        const response = await fetch(`/api/getFollowing`, {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
        });
        const responsee= await response.json()
        console.log("printing")
        console.log(responsee)
        setFollowing(responsee)
      }
    catch(e)
    {
        console.log(e)
    }
  } ,[] 
    )
    const navigate=useNavigate()
    const  handleEdit = () => {
      navigate("/EditProfile")
    };
    const helloFollowers = async e=>
    {
      try {
        const response = await fetch(`/api/removeFollowers`, {
        method: 'POST',
        body : JSON.stringify({jwt:cookies['jwt'],del:e}),
        headers: { 'Content-Type': 'application/json' },
        });
        const responsee= await response.json()
        setFollowing(responsee)
      }
    catch(e)
    {
        console.log(e)
    }
      setFollowers(
          followers.filter(a =>
            a !== e
          )
        )
        console.log(e)
        console.log(followers)
    }
    const goChat = async e=>
    {
       // window.location="/Chat/"+String(e)
       navigate("/Chat/"+String(e))
    }
    const helloFollowing = async e=>
    {
          try {
            const response = await fetch(`/api/removeFollowing`, {
            method: 'POST',
            body : JSON.stringify({jwt:cookies['jwt'],del:e}),
            headers: { 'Content-Type': 'application/json' },
            });
            const responsee= await response.json()
            setFollowing(responsee)
          }
        catch(e)
        {
            console.log(e)
        }
          setFollowing(
              followers.filter(a =>
                a !== e
              )
            )
            console.log(e)
            console.log(followers)
    }
      // send a login request to the server with the entered username and password
      ///follower
      const listItems = followers.map((item, index) => (
        <li key={index}>{item}  <button onClick={e=>helloFollowers(item)} >
        Unfollow 
      </button>
      </li> 
      ));
      const seclistItems = following.map((item, index) => (
        <li key={index}>{item}  <button onClick={e=>helloFollowing(item)} >
        Unfollow 
      </button>
      </li> 
      ));
      ///array1.filter(element => array2.includes(element));
      const tlistItems=followers.filter(element=> following.includes(element)).map((item, index) => (
        <li key={index}>{item}  <button onClick={e=>goChat(item)} >
        Chat 
      </button>
      </li> 
      ));

  const [showPopup, setShowPopup] = useState(false);

  const handleEditt = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  const Save = async () =>
  {
    closePopup()
    const cur=JSON.stringify({username:username,password:password,email:email,contact:contact,FirstName:FirstName,LastName:LastName,Age:Age,jwt:cookies['jwt']})
    const response = await fetch(`/api/editProfile`, {
      method: 'POST',
      body: cur,
      headers: { 'Content-Type': 'application/json' },
    });
    window.location.reload()

  };

      return (
        <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '50px 0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden' }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ marginLeft: '20px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '5px' }}>Username :{userInfo['username']}</h2>
                <p style={{ fontSize: '16px', marginBottom: '5px' }}>IIITH UG</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>Contact: {userInfo.contact}</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>First Name: {userInfo.FirstName}</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>Last Name: {userInfo.LastName}</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>Email: {userInfo.email}</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>Age: {userInfo.Age}</p>
                <p style={{ fontSize: '16px', marginBottom: '0' }}>Contact Number: {userInfo.contact}</p>


              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button style={{ backgroundColor: '#0079d3', color: '#ffffff', padding: '10px 20px', borderRadius: '5px' }} onClick={handleEditt}>Edit Profile</button>
              {showPopup ? (
        <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '5px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)', maxWidth: '500px', width: '100%' }}>
            <h2>Edit Profile</h2>
            <form>
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor="firstName" style={{ display: 'block', fontWeight: 'bold' }}>New First Name</label>
    <input type="text" id="firstName" name="firstName" required style={{ padding: '.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}     value={FirstName}           onChange={event => setFirstName(event.target.value)} />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor="lastName" style={{ display: 'block', fontWeight: 'bold' }}>New Last Name</label>
    <input type="text" id="lastName" name="lastName" required style={{ padding: '.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}   value={LastName}          onChange={event => setLastName(event.target.value)} />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor="email" style={{ display: 'block', fontWeight: 'bold', marginBottom: '.5rem' }}     >New Email</label>
    <input type="email" id="email" name="email" required style={{ padding: '.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }} value={email}  onChange={event => setemail(event.target.value)}/>
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor="age" style={{ display: 'block', fontWeight: 'bold', marginBottom: '.5rem' }}   >New Age</label>
    <input type="number" id="age" name="age" required style={{ padding: '.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}       value={Age}   onChange={event => setAge(event.target.value)} />
  </div>
  <div style={{ marginBottom: '1rem' }}>
    <label htmlFor="age" style={{ display: 'block', fontWeight: 'bold', marginBottom: '.5rem' }}     >New Contact Number</label>
    <input type="number" id="age" name="age" required style={{ padding: '.5rem', borderRadius: '5px', border: '1px solid #ccc', width: '100%' }}       value={contact}    onChange={event => setcontact(event.target.value)}/>
  </div>
  <div style={{ textAlign: 'center' }}>
    <button type="submit" style={{ backgroundColor: '#0079d3', color: '#ffffff', padding: '10px 20px', borderRadius: '5px', border: 'none' }} onClick={()=>Save()}>Save Changes</button>
  </div>
</form>

            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      ) : null}
            </div>
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="px-3">
                         <Popup trigger={<button style={{ backgroundColor: '#white', color: 'green', padding: '10px 20px', borderRadius: '5px', marginRight: '20px' }} > Follower </button>} >
                           <ul>
                           {listItems}
                         </ul>
                           </Popup>
                           <Popup trigger={<button  style={{ backgroundColor: '#white', color: '#red', padding: '10px 20px', borderRadius: '5px', marginRight: '20px' }}> Following </button>} >
                           <ul>
                           {seclistItems}
                         </ul>
                           </Popup>
                           <Popup trigger={<button  style={{ backgroundColor: '#white', color: '#blue', padding: '10px 20px', borderRadius: '5px', marginRight: '20px' }}> Chat </button>} >
                           <ul>
                           {tlistItems}
                         </ul>
                           </Popup>
                       </div>
              </div>
            </div>

        </div>
      );
      
};  

 /* float: right;
  width: 300px;
  border: 3px solid #73AD21;
  padding: 10px;*/

export function EditProifle()
{

}

export function Chat()
{
  //localhost:5000/getMessage
  let { id } = useParams();
  const [messages, setMessagaes] = useState([]);
  const [cookies, setCookie] = useCookies(['user']);
  const [text,setText]= useState("") 
  useEffect(()=>{
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
  }},[]
  )
 
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
  
  async function period()
  {
    //code goes here that will be run every 5 seconds.    
      try {
        const response = await fetch(`/api/getMessage`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],"OtherId":id}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      setMessagaes(responsee["message"])
      console.log("here")
      console.log(responsee["message"])
      }
      catch(e)
      {
        console.log(e)
      }
      setTimeout(period, 1000);
  }


  useEffect(() => {

    period()
  },[]);
    const mergedChat=[{msg:"hi hello so but what are yu ding is important but not important thanmfj erkfre freknferkjnfjkrekfjnerkjfnerkjfnreknfekrfnkernfrekfnfkejrnf u",epoch:2,type:0},{msg:"yes",epoch:3,type:1},{msg:"no",epoch:4,type:1},{msg:"yes hi hello",epoch:100,type:0}]
    let idx=0
    const listItems =messages.map((item, index) => 
    item['type']==0?( 
       <ol key={index}> 
      <p style={{positon:"absolute",textAlign:"right",width:"50%",marginLeft:"auto",border:"15px solid green"
}} >{item["Message"]} </p>
      </ol> 
      ):
    (
      <ol key={index}>
      <p style={{positon:"absolute",textAlign:"left",width:"50%",marginRight:"0",border:"15px solid orange"
}} >{item["Message"]}</p>
        </ol> 
    ));
  async function check(e)
  {
    e.preventDefault()
    document.getElementById("sform").reset();

    
 try {
        const response = await fetch(`/api/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],"OtherId":id,"message":text,type:0}),
        headers: { 'Content-Type': 'application/json' },
      });
       }
      catch(e)
      {
        console.log(e)

      } 
     }
  return (
  <div>
    {listItems}
   <div className="chatInputWrapper">
          <form onsubmit="check"
          id="sform"
          style ={{  display: "grid",
}}>
            <input
              className="textarea input"
              type="text"
              placeholder="Enter your message..."
              onChange={event => {setText(event.target.value)}}
             />
             <button onClick={check}>
              Send
             </button>
          </form>
  </div>
</div>
  )
}

export default ProfilePage;  
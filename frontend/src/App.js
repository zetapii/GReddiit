import React, { useState } from 'react';
import './App.css'
import { Link, Routes, Route,useNavigate,useParams } from "react-router-dom";
import ProfilePage, { EditProifle,Chat} from './profilepage';
import "./homenav"
import {Navbar,Navbarr} from './homenav';
import  './MySubGreddiits';
import './homenav'
import { useEffect } from 'react';
import { CreateMySubGreddiits,ShowUsers,ShowUsersRequests } from './MySubGreddiits';
import  {SettingsPage} from './SubGreddiits.js'
import PostPage from './SubGreddiitsPost';
import  {SavedPostPage}  from './SubGreddiitsPost';
import { useCookies } from 'react-cookie';
import { UploadTesting, verify,ImageDisplay} from './auth.js'
import { ShowReportedPages } from './MySubGreddiits';
import { axios } from 'axios';
import { ShowStats } from './stats';
import { SpecPost } from './SubGreddiitsPost';

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');
  const [contact, setcontact] = useState('');
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');
  const [Age, setAge] = useState('');
  const [cookies, setCookie] = useCookies(['user']);
  const [loginpage, setloginpage] = useState("true");
 
  const changeRendertoLogin = () => {
    setloginpage("false");
  };
  
  const changeRendertoSignup= () => {
    setloginpage("true");
    // send a login request to the server with the entered username and password
  };



  if(loginpage=="true")
  {
    const f = async ()=>
    {
        
        try 
        {
          const response = await fetch(`/api/verify`, {
          method:'POST',
          body: JSON.stringify({ jwt:cookies["jwt"]}),
          headers: { 'Content-Type': 'application/json' },
          });
           const responsee = await response.json()
           if(responsee["message"]=="success")
          {
            window.location='/home'
          }
          }
          catch(e)
          {
            console.log(e)
          }
    }
    f()
    const handleSubmit = async event => {
    console.log(event);
    event.preventDefault();
    try {
      const response = await fetch(`/api/login`, {
      method:'POST',
      body: JSON.stringify({ username : username ,password:password}),
      headers: { 'Content-Type': 'application/json' },
    });
    let responsee=await response.json();
    if(responsee["err"])
    {
      alert(responsee["err"])
    }
    else if(responsee["message"])
    {
      setCookie('jwt', responsee["message"], { path: '/' ,expires: new Date(Date.now() + 30 * 86400 * 1000)});
      console.log(cookies.jwt)
      navigate("/home")
    }
    else 
    {
      alert("eror")
    }
   } catch (err) 
      {
        alert(err)
        console.error(err);
      }
      };
      const backgroundImage = {
        backgroundImage: 'url("https://media.licdn.com/dms/image/C5612AQEB5NxC-C6K6w/article-cover_image-shrink_720_1280/0/1604527373476?e=2147483647&v=beta&t=GNiEZKVy7P504VfvEWaYwqW_IL3DraOmgHDYiVlzU2o")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        height: "100vh" // set the height to 100% of the viewport height

      };
    
      return (
        <div style={backgroundImage}>

        <div className="login-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h1 className="login-form-title">SubGreddiit</h1>
            <label className="login-form-label">
              Username:
              <input
                type="text"
                value={username}
                onChange={event => setUsername(event.target.value)}
                className="login-form-input"
              />
            </label>
            <br />
            <label className="login-form-label">
              Password:
              <input
                type="password"
                value={password}
                onChange={event => setPassword(event.target.value)}
                className="login-form-input"
              />
            </label>
            <br />
            <button type="submit" disabled={!username || !password}  style={{backgroundColor: (!username||!password) ? 'red' : 'blue',
    }} className="login-form-button">
              Log in
            </button>
          </form>
        </div>
        <div className="footer">
              <button type="button" className="btn" style={{    width: "120px", height: "40px",
        border: "none",
        "margin-top": "20px",
        "background-color": "#007bff",
        color: "white",
        "font-size": "16px",
        cursor: "pointer",
        position : "absolute",
        float : "center",
        left:"660px"}
        }onClick={changeRendertoLogin} >
                Register
              </button>
            </div>
        </div>
      );
    
  }
  else 
  {
    const handleSubmit = async event => {
      console.log(event)
      const cur=JSON.stringify({username:username,password,email:email,contact:contact,FirstName:FirstName,LastName:LastName,Age:Age,followers:[]})
      event.preventDefault();
      try {
        const response = await fetch(`/api/register`, {
        method: 'POST',
        body: cur,
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      console.log(responsee)
      if(responsee["err"])
      {
        alert(responsee["err"])
      }
      else if(responsee["message"]!="error")
      {
        setCookie('jwt', responsee["message"], { path: '/' ,expires: new Date(Date.now() + 30 * 86400 * 1000)});
        console.log(cookies.jwt)
        navigate("/home")
      }
      else 
      {
        navigate("/")
      }
     } catch (err) 
        {
          console.error(err);
        }
      //console.log(response);
      //send a login request to the server with the entered username and password
  };

  return  (
  <div style={{display: 'flex', flexDirection: 'column',backgroundImage:'url("https://media.licdn.com/dms/image/C5612AQEB5NxC-C6K6w/article-cover_image-shrink_720_1280/0/1604527373476?e=2147483647&v=beta&t=GNiEZKVy7P504VfvEWaYwqW_IL3DraOmgHDYiVlzU2o")',height:"100vh"}}>
    <h1>IIIT SubGreddiit Registration</h1>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Username:</label>
    <input
      type="text"
      value={username}
      onChange={event => setUsername(event.target.value)}
      className="login-form-input"
    />
  </div>
  <br></br>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Password:</label>
    <input
      type="password"
      value={password}
      onChange={event => setPassword(event.target.value)}
      className="login-form-input"
    />
  </div>
  <br></br>

  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Email:</label>
    <input
      type="text"
      value={email}
      onChange={event => setemail(event.target.value)}
      className="login-form-input"
    />
  </div>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>First Name:</label>
    <input
      type="text"
      value={FirstName}
      onChange={event => setFirstName(event.target.value)}
      className="login-form-input"
    />
  </div>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Last Name:</label>
    <input
      type="text"
      value={LastName}
      onChange={event => setLastName(event.target.value)}
      className="login-form-input"
    />
  </div>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Age:</label>
    <input
      type="text"
      value={Age}
      onChange={event =>
        {
          if(!isNaN(event.target.value)) setAge(event.target.value)}
        }
      className="login-form-input"
    />
  </div>
  <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
    <label style={{marginRight: '10px'}}>Contact No:</label>
    <input
      type="text"
      value={contact}
      onChange={event =>{
        if(!isNaN(event.target.value))
        { setcontact(event.target.value)}
      }
    }
      className="login-form-input"
    />
  </div>
  <button type="submit" disabled={!username||!password || (!email || email.length==0)}  style={{backgroundColor: (!username||!password) ? 'red' : 'blue',
}} className="login-form-button" onClick={handleSubmit}>
    Register 
  </button>
  <button type="submit" className="login-form-button" onClick={changeRendertoSignup}>
    Login 
  </button>
  
</div>)

  }
}
export function Logout() {
  const navigate=useNavigate();
  const [cookies, setCookie] = useCookies(['user']);
  setCookie('jwt','', { path: '/' });
  useEffect(()=>{
    navigate("/")
  }, []) 
  return (<div>
     
  </div>)
}

const App = () => {
 return (
     <>
        <Routes>
           <Route path="/" element={<Login />} />
           <Route path="/chat/:id" element={<Chat />} />
           <Route path="/fetchtest" element={<ImageDisplay/>} />
           <Route path="/uploadtest" element={<UploadTesting/>} />
           <Route path="/SavedPosts" element={<SavedPostPage />} />
           <Route path="/logout" element={<Logout />} />
           <Route path="/userhome" element={<ProfilePage />} />
           <Route path="/editprofile" element={<EditProifle />} />
           <Route path="/home" element={<Navbar />} />
           <Route path="/MySubGreddiits" element={<CreateMySubGreddiits />} />
           <Route path="/MySubGreddiits/info" element={<Navbarr />} />
           <Route path="/SubGreddiits" element={<SettingsPage />} />
           <Route path="/SubGreddiits" element={<PostPage />} />
           <Route path="/SubGreddiits/moderator/:id" element={<Navbarr />} />
           <Route path="/SubGreddiits/moderator/:id/Users" element={<ShowUsers />} />
           <Route path="/SubGreddiits/moderator/:id/ReportedPage" element={<ShowReportedPages />} />
           <Route path="/SubGreddiits/moderator/:id/stats" element={<ShowStats />} />
           <Route path="/SubGreddiits/:id" element={<PostPage />} />
           <Route path="/SubGreddiits/moderator/:id/JoiningRequestsPage" element={<ShowUsersRequests />} />
           <Route path="/SubGreddiits/:id/Post/:id_" element={<SpecPost />} />
        </Routes>
     </>
  );
 };
 
export default App;
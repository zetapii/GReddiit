import React, { Component } from 'react';    
import Popup from 'reactjs-popup';
import "react-table-v6/react-table.css";  
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import { useState,useEffect } from 'react';
import { useNavigate, useNavigation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { FaSkullCrossbones } from 'react-icons/fa';
import {decode as base64_decode, encode as base64_encode} from 'base-64';
export const verify = async function (cookies,obj=null)
{   
    try {
        const response = await fetch(`/api/verify`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt']}),
        headers: { 'Content-Type': 'application/json' },
    });
    let responsee=await response.json();
    if(responsee["message"]=="error")
    {
        console.log(responsee["message"])
        var url= "/";
        window.location = url;
            return false;
    }
    else 
    {
  //        return true;
    }
    } catch (err) 
    {
        var url= "/";
    window.location = url;
        console.error(err);
      //  return false;
    }
    if(obj)
    {
      try {
        const response = await fetch(`/api/verifyPerm`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],Id:obj.perm}),
        headers: { 'Content-Type': 'application/json' },
    });
    let responsee=await response.json();
    // alert(JSON.stringify(responsee))
    if(responsee["message"]=="error")
    {
        console.log(responsee["message"])
        var url= "/";
        window.location = url;
            return false;
    }
    else 
    {
        return true;
    }
    } catch (err) 
    {
        var url= "/";
    window.location = url;
        console.error(err);
        return false;
    }
    }
};

export function FetchTest()
{
    const [fetched,setFetched]=useState('')
    useEffect(async ()=>{
        try {
          const response = await fetch(`/api/getImage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          });
          console.log(response)
          let responsee=await response.json();
          responsee["i"]="ff"
          setFetched(responsee)
          // alert("lmao")
        }
      catch(e)
      {
        // alert("f")
          console.log(e)
      }
    } ,[] 
      )
    return (
        <div>
            {fetched["Img"]}
        </div>
    )
}

function convertBufferToBase64(buffer) {
    console.log(buffer)
    console.log("lmao")
    console.log(base64_encode(buffer));
    return   base64_encode(buffer);
  }

export function ImageDisplay() {
    const [image, setImage] = useState(null);
    useEffect(() => {
      fetch(`../../getImage`,{method:"POST"})
        .then((response) => response.json())
        .then((data) => {setImage(data[0]["Img"]);
             console.log(data[0]["Img"])});
        
    },[]);
    return (
      <div>
        {image|| !image ? (
            <img src={`data:image/png;charset=utf-8;base64,${image}`}/>
        ) : (
          <p>Loading image...</p>
        )}
      </div>
    );
  }
  
  

export function UploadTesting() {
    const [image, setImage] = useState({ preview: '', data: '' })
    const [status, setStatus] = useState('')
    const handleSubmit = async (e) => {
      e.preventDefault()
      let formData = new FormData()
      formData.append('file', image.data)
      const response = await fetch('/api/image', {
        method: 'POST',
        body: formData,
      })
      if (response) setStatus(response.statusText)
    }
  
    const handleFileChange = (e) => {
      const img = {
        preview: URL.createObjectURL(e.target.files[0]),
        data: e.target.files[0],
      }
      setImage(img)
    }
    return(
    <div className='App'>
    <h1>Upload to server</h1>
    {image.preview && <img src={image.preview} width='100' height='100' />}
    <hr></hr>
    <form onSubmit={handleSubmit}>
      <input type='file' name='file' onChange={handleFileChange}></input>
      <button type='submit'>Submit</button>
    </form>
    {status && <h4>{status}</h4>}
  </div>)
};
export default verify;
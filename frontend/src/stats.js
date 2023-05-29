import React, { useState } from "react";
import Fuse from 'fuse.js';
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Line } from 'react-chartjs-2';
import verify from "./auth";

const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
    return date.toLocaleString(undefined, options);
    };
  
export const ShowStats = () => {
  
    let { id } = useParams();
    const [data, setData] = useState({});
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
        const response = await fetch(`/api/verifyPerm`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],Id:id}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      // alert(JSON.stringify(responsee))
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
    useEffect(async () => {
      try {
        const response = await fetch(`/api/getStats`, {
          method: 'POST',
          body: JSON.stringify({ jwt: cookies['jwt'], Id: id }),
          headers: { 'Content-Type': 'application/json' },
        });
        const responsee = await response.json();
        setData(responsee["message"]);
        responsee["message"].Visitors=responsee["message"].Visitors.filter((element, index) => index % 2 == 0);
        setData(responsee["message"]);
        // alert(responsee["message"])
      } catch (e) {

        console.log(e);
      }
    }, []);
    return (
        <div>
          <h2 align="center">Stats of Subreddit - {data.Name}</h2>

          <table>
            <tbody>
              <tr>
                <th>Posts</th>
                <td>{data.Posts?.map((post, index) => (
                  <div>
                   <div>
                    Post Number : {index+1}
                  </div>
                  <div key={index}>
                    {formatDate(post)}
                  </div>
                  <br></br>
                  </div>
                )) || '-'}</td>
              </tr>
              <tr>
                <th>Followers Joined</th>
                <td>{data.Followers?.map((follower, index) => (
                  <div>
                    <div>
                      Follow Number : {index+1}
                    </div>
                  <div key={index}>
                    {formatDate(follower)}
                  </div>
                  <br></br>
                  </div>
                )) || '-'}</td>
              </tr>
              <tr>
                <th>Visitors</th>
                <td>               
                         
                  {data.Visitors?.map((visitor, index) => (
                  <div>
                     Visit Number : {index+1}
                    <div>
                    </div>
                  <div key={index}>
                     {formatDate(visitor)}
                  </div>
                  <br></br>

                  </div>
                )) || '-'}</td>
              </tr>
              <tr>
                <th>Reports</th>
                <td>
                  <div>
                    Reported: {data.Reports?.filter((report) => report.hasOwnProperty('reported post id')).length || '-'}
                    <br />
                    <br />
                    Deleted: {data.Reports?.filter((report) => report.hasOwnProperty('deleted post id')).length || '-'}
                    <br />
                    <br />
                    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                    <strong>Post Ids and Time of deleted Posts:</strong>
                    <br />
                    {data.Reports?.map((visitor, index) => (
                      <div key={index}>
                        {(visitor["deleted post id"]) ? (<div style={{ border: '1px solid #ccc', padding: '5px', margin: '5px', borderRadius: '5px' }}>{visitor["deleted post id"]}<br></br> {formatDate(visitor["time"])}</div>) : ''}
                      </div>
                    )) || '-'}
                    <br />
                    <strong>Post Ids and Time of reported Posts:</strong>
                    <br />
                    {data.Reports?.map((visitor, index) => (
                      <div key={index}>
                        {(visitor["reported post id"]) ? (<div style={{ border: '1px solid #ccc', padding: '5px', margin: '5px', borderRadius: '5px' }}>{visitor["reported post id"]}<br></br> {formatDate(visitor["time"])}</div>) : ''}
                      </div>
                    )) || '-'}
                  </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
      
 };
  
import React, { useState } from "react";
import Fuse from 'fuse.js';
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useCallback } from 'react';
import { useMemo } from "react";

export  const SettingsPage = () => {
    const [query, updateQuery] = useState('');
    const [result, updateResult] = useState([]);
    const [copyresult,updatecopyresult]=useState([])
    const [secresult, updatesecResult] = useState([]);
    const [copysecresult, updatecopysecResult] = useState([]);
    const [checkedList, setCheckedList] = useState([]);
    const [cookies, setCookie] = useCookies(['user']);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("nameAsc");
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
    var listData=[]
    const navigate = useNavigate()

    function handleSubmitOpen (event) {
      const res="/SubGreddiits/"+String(event);
      window.location=res
    };
    
  async function handleSubmitLeave (event) {
    console.log(event)
    try {
      const response = await fetch(`/api/deleteSubGreddiitUsers`, {
      method: 'POST',
      body : JSON.stringify({jwt:cookies['jwt'],Id:event,del:"self"}),
      headers: { 'Content-Type': 'application/json' },
      });
      const responsee= await response.json()
      if(responsee["message"]=="moderator can't leave")
      {
        alert("moderator can't leave")
        return
      }
      else 
      {
        window.location.reload()
        updateResult( responsee);
        updatecopyresult(responsee)
        console.log(responsee)
      }

  }
  catch(e)
  {
        console.log(e)
  } 
} 
async function handleSubmitReq (event) {
  console.log(event)
  try {
    const response = await fetch(`/api/creatSubGreddiitRequests`, {
    method: 'POST',
    body : JSON.stringify({jwt:cookies['jwt'],Id:event,new:event}),
    headers: { 'Content-Type': 'application/json' },
    });
    const responsee= await response.json()
    // alert(JSON.stringify(responsee))
    if(responsee["message"]=="either you are blocked from this subgreddiit or you left it after joining")
    {
        alert("either you are blocked from this subgreddiit or you left it after joining")
    }
    else if(responsee["message"]=="success")
    {
      alert("request sent")
    }
    console.log(responsee)
}
catch(e)
{
      console.log(e)
} 
} 
    var pre=0;
    useEffect(async ()=>{
      try {
            const response = await fetch(`/api/getAllGreddiitPage`, {
            method: 'POST',
            body : JSON.stringify({jwt:cookies['jwt']}),
            headers: { 'Content-Type': 'application/json' },
            });
            const responsee= await response.json()
            updateResult(responsee);
            updatecopyresult(responsee)
            console.log(responsee)
        }
        catch(e)
        {
              console.log(e)
        }
        try {
          const response = await fetch(`/api/getAllTags`, {
          method: 'POST',
          body : JSON.stringify({jwt:cookies['jwt']}),
          headers: { 'Content-Type': 'application/json' },
          });
          const responsee= await response.json()
          listData=responsee
          console.log(responsee)
          console.log(listData)
      }
      catch(e)
      {
            console.log(e)
      }
        try {
          const response = await fetch(`/api/getAllGreddiitPageNotFollowing`, {
          method: 'POST',
          body : JSON.stringify({jwt:cookies['jwt']}),
          headers: { 'Content-Type': 'application/json' },
          });
          const responsee= await response.json()
          updatesecResult( responsee);
          updatecopysecResult(responsee)
          console.log(responsee)
      }
      catch(e)
      {
          console.log(e)
      }
       
      },[])

  const handleSort = useCallback((criteria, order) => {
    setSortBy(criteria);
    setSortOrder(order);
  }, []);

      const searchData = useCallback(() => {
        const res=copyresult
        const ress=copysecresult
        console.log(res)
        const fuse = new Fuse(res, {
          keys: ['Name'],
          threshold: 0.3,
        });
        const fusee=new Fuse(ress, {
          keys: ['Name'],
          threshold: 0.3,
        });
        const searchResult = fuse.search(searchTerm);
        const searchResultt = fusee.search(searchTerm);

        console.log("this is search result")
        console.log(searchTerm)
        console.log(result)
        console.log(copyresult)
        console.log(searchResult)
        let t;
        if(searchTerm!=="")
        {
            updateResult(searchResult);
            updatesecResult(searchResultt);
        }
        else 
        {
            updateResult(copyresult)
            updatesecResult(copysecresult)
        }
        return result;
      }, [searchTerm,sortBy]);
    
      useEffect(() => {
        searchData();
      }, [searchData]);

      const [allTags, setAllTags] = useState(["check","check"]);
      const [selectedTags, setSelectedTags] = useState(["check","check"]);
    
        const sortedData = useMemo(() => {
          console.log(sortBy)
          if(sortBy=="nameAsc")
            return result.sort((a, b) => (a.Name > b.Name ? 1 : -1));
          else if(sortBy=="nameDesc")
            return result.sort((a, b) => (a.Name < b.Name ? 1 : -1));
          else if(sortBy=="followers")
          {
            return result.sort((a, b) => 
            {
              const f=new Set(a["Followers"])
              const s=new Set(b["Followers"])
              console.log(f.size);
              console.log(s.size);
              return (f.size > s.size ? -1: 1)});
            }
            else 
              return result;
        }, [result,sortBy,secresult]);

        const sortedsecData = useMemo(() => {
          console.log(sortBy)
          if(sortBy=="nameAsc")
            return secresult.sort((a, b) => (a.Name > b.Name ? 1 : -1));
          else 
            return secresult.sort((a, b) => (a.Name < b.Name ? 1 : -1));
        }, [result,sortBy,secresult]);
      

    const handleSearch = e => {
      setSearchTerm(e.target.value);
    };
  function handleTagSelection(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

 return (
    <div className="App">
      <header className="App-header">
        <h2>Subgreddiit</h2>
      </header>
      <input
  type="text"
  className="search-bar"
  placeholder="Search by name"
  value={searchTerm}
  onChange={handleSearch}
  />
      <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{marginLeft:"20px"}}>
      <option value="none">Select an Option</option>
      <option value="nameAsc">Sort by Name (Ascending)</option>
      <option value="nameDesc">Sort by Name (Descending)</option>
      <option value="followers">Sort by Followers (Descending)</option>
      <option value="creationDate">Sort by Creation Date (Newest First)</option>
    </select>
    <div>
</div>

      <main className="App-content">
        <table>
        <th colspan="7">Joined</th>

          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Tags</th>
              <th>BannedKeywords</th>
              <th>Number of People</th>
              <th>Image</th>
              <th>Actions</th>

            </tr>
          </thead>
          <tr>
        </tr>
          <tbody>
            {sortedData.map((item, index) => (
              <tr key={index}>
                <td style={{ backgroundColor: '#f2f2f2' }}>{item["Name"]}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["Description"]}</td>
                <td style={{ backgroundColor: '#f2f2f2' }}>{item["Tags"]+" "}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["BannedKeywords"].join(",")}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["Followers"].length}</td>

                {item["Image"] ? (
        <td style={{ backgroundColor: '#f2f2f2' }}>
          <img src={`data:image/png;base64,${item["Image"]}`} width="100" height="100" />
        </td>
      ) : (
        <img src="https://via.placeholder.com/150x150.png?text=Dummy+Image" alt="Dummy Image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
      )}

                <td style={{ backgroundColor: '#f2f2f2' }}>
                  <button onClick={() => handleSubmitOpen(item['Id'])}>Open</button>
                  <button onClick={() => handleSubmitLeave(item['Id'])}>Leave</button>
                </td>
              </tr>
            ))
            }
          </tbody>
          <tr>
          <th colspan="7">Not Joined</th>
        </tr>
          <tbody>
            {
          sortedsecData.map((item, index)=>(
              <tr key={index}>
                <td style={{ backgroundColor: '#f2f2f2' }}>{item["Name"]}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["Description"]}</td>
                <td style={{ backgroundColor: '#f2f2f2' }}>{(item["tags"])+","}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["BannedKeywords"]+","}</td>
                <td style={{ backgroundColor: '#f9f9f9' }}>{item["Followers"].length}</td>
                {item["Image"] ? (
        <td style={{ backgroundColor: '#f2f2f2' }}>
          <img src={`data:image/png;base64,${item["Image"]}`} width="100" height="100" />
        </td>
      ) : (
        <img src="https://via.placeholder.com/150x150.png?text=Dummy+Image" alt="Dummy Image" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
      )}


                <td style={{ backgroundColor: '#f2f2f2' }}><button onClick={() => handleSubmitReq(item['Id'])}>Send Join Request</button>
                
                </td>
                
              </tr>
            ))
          }
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default SettingsPage;

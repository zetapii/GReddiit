lert("here")
      try {
        const response = await fetch(`http://localhost:5000/verifyPerm`, {
        method: 'POST',
        body: JSON.stringify({ jwt:cookies['jwt'],Id:id}),
        headers: { 'Content-Type': 'application/json' },
      });
      let responsee=await response.json();
      alert(responsee["message"])
      if(responsee["message"]=="error")
      {
         // window.location="/"
      }
      }
      catch(e)
      {
        console.log(e)
      //  window.location="/"
      }
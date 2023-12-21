document.addEventListener("DOMContentLoaded", function () {
    const fileLayout = document.querySelector(".fileLayout");
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
  
  
    fetchAndDisplayFiles(username, token);
  
    function fetchAndDisplayFiles(username, token) {
     
      fetch(`http://localhost:3000/files/${username}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
          const files = data.files;
          displayFiles(files);
        })
        .catch((error) => {
          console.error("Error fetching files:", error);
        });
    }
    
    
    function displayFiles(files) {
        // fileLayout.innerHTML = "";
      
        files.forEach((file) => {
          const fileDiv = document.createElement("div");
          fileDiv.classList.add("file");
      
          const filenameLink = document.createElement("a");
          filenameLink.classList.add("filename");
          filenameLink.textContent = file.filename;
          filenameLink.href = `http://localhost:3000/download/${file._id}`;
          filenameLink.target = "_blank"; 
          filenameLink.addEventListener("click", (event) => {
            event.preventDefault();
            downloadFile(file._id);
          });
      
          const sharedToDiv = document.createElement("div");
          sharedToDiv.classList.add("shared-to");
          sharedToDiv.textContent = file.accessTo;
      
          const sizeDiv = document.createElement("div");
          sizeDiv.classList.add("size");
          console.log('File size:', file.size);
          sizeDiv.textContent = (file.size / 1e+6).toFixed(1) + "mb";
      
          const deleteButton = document.createElement("button");
          deleteButton.classList.add("delete-button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", () => {
            deleteFile(file._id, token);
          });
      
          const shareButton = document.createElement("button");
          shareButton.classList.add("share-button");
          shareButton.textContent = "Share";
          shareButton.addEventListener("click", () => {
            
            const sharedUsername = prompt("Enter the username to share with:");
      
            
            if (sharedUsername) {
              
              shareFile(file._id, token, sharedUsername, file.filename);
            }
          });
      
          fileDiv.appendChild(filenameLink);
          fileDiv.appendChild(sharedToDiv);
          fileDiv.appendChild(sizeDiv);
          fileDiv.appendChild(deleteButton);
          fileDiv.appendChild(shareButton);
      
          fileLayout.appendChild(fileDiv);
        });
      }
  
      function deleteFile(fileId, token) {
        
        fetch(`http://localhost:3000/delete/${fileId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
          
            if (data.message === "File deleted successfully") {
            
              const username = localStorage.getItem("username");
              fetchAndDisplayFiles(username, token);
            } else {
              console.error("Error deleting file:", data.message);
            }
          })
          .catch((error) => {
            console.error("Error deleting file:", error);
          });
      }
  
    function shareFile(fileId, token, sharedUsername, filename) {
        
        fetch(`http://localhost:3000/share/${fileId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            username: sharedUsername,
            filename: filename,
          }),
        })
          .then((response) =>{
            if(!response.ok){
              alert("INVALID USERNAME")
            }
            return response.json();
          })
          .then((data) => {
            if (data.message === "Invalid username or user not found") {
              // Display an alert for an invalid username
              alert("Invalid username or user not found");
            } else {
              // File shared successfully
              // console.log("File shared successfully:", data);
            }
            
            // console.log("File shared successfully:", data);
          })
          .catch((error) => {
            console.error("Error sharing file:", error);
          });
    }

    function downloadFile(fileId) {
       
        const downloadUrl = `http://localhost:3000/download/${fileId}`;
      
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = ''; 
        link.style.display = 'none'; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
  
    
  });
  
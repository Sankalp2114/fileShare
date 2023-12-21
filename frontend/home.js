document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("fileInput");
  const uploadButton = document.getElementById("uploadButton");


  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  uploadButton.addEventListener("click", () => {
    const files = fileInput.files;
    if (files.length > 0) {
      handleFileUpload(files, token, username);
    } else {
      alert("Please select files to upload.");
    }
  });

  function handleFileUpload(files, token, username) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i], files[i].name);
    }

   
    formData.append("token", token);
    formData.append("username", username);

    console.log(formData);

    fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
      });
  }
});

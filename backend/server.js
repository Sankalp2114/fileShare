const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const File = require('./models/files');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);

const app = express();
const port = 3000;

const storage = multer.diskStorage({
  destination: "./files", 
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

app.use(express.json({ limit: '50mb' }));
app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend')));
app.options('*', cors());
//Name of the folder where you want to save the uploaded files
const uploadFolder = './files';

app.post("/upload", upload.array("files"), async (req, res) => {
  console.log("Files uploaded successfully");

  try {
    const uploadedByUser = req.body.username; 

    
    for (const file of req.files) {
      
      const uniqueFilename = `${Date.now()}_${file.originalname}`;

     
      const filePath = path.join(uploadFolder, uniqueFilename);
      const fileSize = file.size;

      
      const newFile = new File({
        location: filePath,
        filename: file.originalname,
        uploadedBy: uploadedByUser,
        accessTo: '', 
        size: fileSize,
      
      });

      await newFile.save();
    }

    res.json({ message: "Files uploaded successfully" });
  } catch (error) {
    console.error("Error uploading files:", error);
    res.status(500).json({ message: "Error uploading files", error });
  }
});


//Important
mongoose.connect('mongodb+srv://YourDetailsHere.x1bfsss.mongodb.net/', {
 
});

const db = mongoose.connection;
db.once('open', () => {
  console.log('Connected to the database');
});

app.post('/signup', async (req, res) => {


  const { username, password } = req.body;
  

  try {
    const alreadyuser = await User.findOne({username});
    
  if(alreadyuser && username === alreadyuser.username){
    return res.status(400).json({
      message: 'User Already Exists'
    });
  }
    const newUser = await User.create({
      username,
      password
    });

    res.status(201).json({
      message: 'User created successfully!'
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error creating user',
      error
    });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    const pass = await User.findOne({ password });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    
    }
    if (password !== user.password) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    
    }

    
    const isPasswordValid = user.password;

    if (isPasswordValid) {

      const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });

      res.status(200).json({
        message: 'Login successful!',
        token,
        username: user.username
      });
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error during login',
      error,
    });
  }
});

app.get('/files/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const files = await File.find({ uploadedBy: username });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error });
  }
});
app.get('/recfiles/:username', async (req, res) => {
  const username = req.params.username;

  try {
    const files = await File.find({ accessTo: username });
    res.json({ files });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files', error });
  }
});

app.post("/share/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const { username, filename } = req.body;
  
  try{
    const user = await User.findOne({ username });
    if(!user){
      return res.status(401).json({
        message:"Invalid username"
      });
    }else{
      try {

        const file = await File.findById(fileId);
        
        if(!file){
          return res.status(404).json({message: "File not found"})
        }
        file.accessTo = username;
    
        await file.save();
    
        res.status(200).json({
          message: "File shared successfully",
          file: file,
        });
      } catch (error) {
        res.status(500).json({
          message: "Error sharing file",
          error: error.message,
          
        });
      }
      
    }
  }catch(error){
    res.status(500).json({
      message:"Error Sharing file",
      error: error.message,
    })
  }
  
});

app.get('/download/:fileId', async (req, res) => {
  const fileId = req.params.fileId;

  try {
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const fileName = file.filename;
    const filePath = `files/${fileName}`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error downloading file', error });
  }
});

app.delete('/delete/:fileId', async (req, res) => {
  const { fileId } = req.params;

  try {
    // Find the file by ID and remove it from the database
    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: 'File not found' });
    }

    return res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Error deleting file', error: error.message });
  }
});

app.post("/recdelete/:fileId", async (req, res) => {
  const { fileId } = req.params;
  const { username, filename } = req.body;
 
 
    try {

      const file = await File.findById(fileId);
        
      if(!file){
        return res.status(404).json({message: "File not found"})
      }
      file.accessTo = "";
  
      await file.save();
    
      res.status(200).json({
        message: "File shared successfully",
        file: updatedFile,
      });
    } catch (error) {
        res.status(500).json({
        message: "Error sharing file",
        error,
      });
    }
  
});



app.listen(port, () => {
  console.log(`API listening on port ${port}!`);
});

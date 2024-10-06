const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // Serve files from uploads directory

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Rename file with timestamp
  },
})

const upload = multer({ storage: storage })

// Endpoint to upload file
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' })
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`
  res.json({ fileUrl })
})

// Serve frontend static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')))

// Catch-all route to serve index.html (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

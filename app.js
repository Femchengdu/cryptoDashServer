require('dotenv').config()
// Require fs to read from the file system
const fs = require('fs')
const express = require('express')
/**
* Add https as per the docs
*/
const https = require('https')
const http = require('http')
const app = express()

// You need to implement cors
const cors = require('cors')
/*
 * Added the following lines to load the builpath
*/
const path = require('path')

// Http forcing middleware
const forceHttps = (req, res, next) => {
	if(!req.secure){
		res.redirect(301, 'https://' + req.hostname + req.originalUrl)
	}
	next()
}
// force https using app.all
app.all('*', forceHttps)
// middlewares
/*
 * Added to enable buildpath load
*/
app.use(express.static(path.join(__dirname, 'build')))
// middlewares
/*
 * Added to enable cors on all requests
*/
app.use(cors())

/*
* Redirect all request to the home page to enable react router
*/
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

const port = process.env.PORT || 80
/*
 * Added to enable https certificate
*/
const certificateKeyPath = process.env.CERT_KEY_PATH
const serverKeyPath = process.env.SERVER_KEY_PATH
const privateKey  = fs.readFileSync(serverKeyPath, 'utf8')
const certificate = fs.readFileSync(certificateKeyPath, 'utf8')
const options = {key: privateKey, cert: certificate}
/**
* http and https as per the docs
*/
http.createServer(app).listen(port)
https.createServer(options, app).listen(443)
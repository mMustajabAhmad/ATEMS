const express = require('express');
const facRouter = express.Router();
const facFunctions = require('../controller/faculty/faculty.controller');

facRouter.post('/signIn', facFunctions.facultySignIn);
facRouter.get('/supReviewRequest', (req, res)=>{ res.send('Review Supervision Request'); });
facRouter.post('/forwardRequest', (req, res)=>{ res.send('Update announcement here'); });  //forward supervison reuqest to GC
facRouter.post('/addAnnouncement', (req, res)=>{ res.send('Send announcement here'); });
facRouter.get('/viewAnnouncement', (req, res)=>{ res.send('Views announcements here'); });
facRouter.get('/msrcReviewRequest', (req, res)=>{ res.send('Review MSC Request'); });
facRouter.post('/msrcComment', (req, res)=>{ res.send('Give comments here'); });

module.exports = facRouter;
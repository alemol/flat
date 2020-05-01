const express = require('express');
const router = express.Router();

const pool = require("../databaseInterviews");

router.get('/',async (req,res)=>{
   const Interviews = await pool.query('SELECT idInterview,idSubject,idInterviewer FROM austenriggs.interviews order by idInterview');
   //console.log(Interviews);
   res.render('interviews/all',{Interviews}); 
});
router.get('/watch/:id',async (req,res)=>{
   const {id} = req.params;
   const interview = await pool.query('select content from austenriggs.interviews where idInterview = ?',[id]);
   //console.log(interview[0].content.split("\n"));
   res.render('interviews/watch',{interview:interview[0].content.split("\n"),idInterview:id}); 
});

module.exports = router;

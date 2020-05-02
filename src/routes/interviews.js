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
   const consultinterview= await pool.query('select * from austenriggs.dialoginterviews where idInterview = ? order by stamp',[id]);
   res.render('interviews/watch',{interview:aggregate(consultinterview),idInterview:id}); 
});
function aggregate(consult){
   var out=[];
   for (const key in consult) {
      let element = consult[key];
      let _person = "";
      if (consult[key].typePerson==1) {
         _person = "S";
      }else{
         _person = "I";
      }
      out.push({content:element.content,person:_person,line:element.stamp});
   }
   return out;
}
module.exports = router;

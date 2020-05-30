const express = require('express');
const router = express.Router();

const pool = require("../databaseInterviews");

router.get('/',async (req,res)=>{
   const Interviews = await pool.query('SELECT idInterview,idSubject,idInterviewer FROM austenriggs.interviews order by idInterview');
   
   res.render('interviews/all',{Interviews}); 
});
router.get('/watch/:id',async (req,res)=>{
   const {id} = req.params;

   const consultinterview  = await pool.query('select * from austenriggs.dialoginterviews where idInterview = ? order by stamp',[id]);
   const consultCategories = await pool.query('select id_cat_tag,title,color from cat_tags');
   var categories=[];
   categories.push(consultCategories);
   categories = categories[0];
   const tags = await pool.query('Select stamp,sentence,id_cat_tag from tagged_process where idDialogInterview =?',[id]);
   tags.forEach(tag => {
      tag.color = categories.find(e=>e.id_cat_tag==tag.id_cat_tag).color;
      tag.id_cat_tag = categories.find(e=>e.id_cat_tag==tag.id_cat_tag).title;
   });
   //console.log(tags);
   res.render('interviews/watch',{interview:aggregate(consultinterview),idInterview:id,categories:consultCategories,tags:tags}); 
});
router.post('/addTag',async (req,res)=>{
   const id_cat_tags=await pool.query('select id_cat_tag,title from cat_tags');
   var categories =[];
   categories.push(id_cat_tags);
   categories = categories[0];
   const recibed = JSON.parse(req.body.tags);

   await recibed.forEach((element) => {
      console.log(element);
      var category = categories.find((e)=>e.title.toLowerCase()==element.id_cat_tag.toLowerCase());
      //console.log(category);   
      if(category==undefined){
         pool.query('INSERT INTO cat_tags set ?',[{title:element.id_cat_tag,color:element.color}]);
         return;
      }
      element.id_cat_tag = category.id_cat_tag;
      delete element.color;
      pool.query('insert into tagged_process set ?',[element]);
   });
   res.status(200);
});
router.post('/deleteTag',async (req,res)=>{
   console.log('in method');
   var tag = JSON.parse(req.body.tag);
   console.log(tag);
   var findetag =await pool.query(`select stamp from tagged_process where stamp = ${tag.stamp} and idDialogInterview =${tag.idDialogInterview}`);
   if(findetag.length==0||findetag==undefined){
      console.log('no data matches');
      return;
   }
   await pool.query(`delete from tagged_process where stamp = ${tag.stamp} and idDialogInterview = ${tag.idDialogInterview}` );

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

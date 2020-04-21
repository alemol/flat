const express = require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    res.send('Pendente renderizado de principal');
});
 
/* 
router.get('/contact.html',(req,res)=>{
    res.render('contact.html',{title:'contact page'});
}); */

module.exports = router; 
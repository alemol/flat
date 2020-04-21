const express =  require('express');
const router =  express.Router();

const pool = require("../databaseInterviews");

router.get('/add',(req,resp)=>{
    resp.render('tags/add');
});
//se envia en el header
router.post('/add',async (req,resp)=>{
    const {title, contents, anotations} = req.body;
    const newtag ={
        title,
        contents,
        anotations
    };
    //console.log(newtag);
    await pool.query('INSERT INTO tags set ?',[newtag]);
    req.flash('success','Tag saved successfully');
    resp.redirect('/tags');

});

router.get('/',async (req,res)=>{
    const tags = await pool.query('SELECT * FROM  tags');
    //console.log(tags)
    res.render('tags/list',{tags});
});

router.get('/delete/:id/',async (req,resp)=>{
    /* console.log(req.params.id);
    resp.send('Deleted'); */
    const {id} = req.params;
    await pool.query('DELETE FROM tags WHERE ID =?',[id]);
    req.flash('success','Tag deletetd successfully');
    resp.redirect('/tags');
});
router.get('/edit/:id/',async (req,resp)=>{
    const {id} = req.params;
    const tags=await pool.query('SELECT * FROM tags WHERE ID =?',[id]);
    console.log(tags[0]);
    resp.render('tags/edit',{ tag: tags[0] }); 
});
router.post('/edit/:id/',async (req,resp)=>{
    const {id} = req.params;
    const {title,contents,anotations} = req.body;
    const newtag ={
        title,
        contents,
        anotations
    };
    await pool.query('UPDATE tags set ? WHERE id =?',[newtag,id]);
    req.flash('success','Tag updated successfully');
    resp.redirect('/tags'); 
});
module.exports = router;
 
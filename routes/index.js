var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const mariadb = require('mariadb');

  mariadb.createConnection({host: 'localhost', user: 'nitin', password: 'nitin', database : "control"})
  .then(conn => {
  
  console.log("connection established successfully");
  /*
    assumed request data {slug , name , permission_id , permissions}
  */
  
  router.post('/add_role',(req,res,next)=>{
    
    var role_id;
    conn.query('select * from counter')
    .then(result => {
      console.log(result[0]);
      role_id = result[0].role_id;
      return conn.query(`insert into Roles (Slug , Name , Permissions , role_id) values ("${req.body.slug}" , "${req.body.name}" , "${req.body.permissions}" , ${role_id+1})`);
    })
    .then(result => {      
      console.log(result);
      
      return conn.query(`insert into permission_role (permission_id , role_id) values (${req.body.permission_id} , ${role_id+1})`);
    })
    .then(result=>{
      console.log(result);
      return conn.query(`update counter set role_id = ${role_id+1}`);
    })
    .then(result => {
      res.json({status : 200 , result : "Role added successfully"});
    })
    .catch(err=>{
      console.log(err);
      next(err);
    })
  });
  
  /*
    assumed request data {role_id}
  */

  router.get('/remove_role/:id',(req,res,next)=>{
    conn.query(`delete from Roles where role_id = ${req.params.id}`)
    .then(result => {
      console.log(result);
      return conn.query(`delete from permission_role where role_id == ${req.params.id}`);
    })
    .then(result => {
      console.log(result);
      res.json({status : 200 , result : "success"})
    })
    .catch(err=>{
      console.log(err);
      res.json({staus : 500 , result : "some internal server error occured" , error_detail : err});
    })
  });

  /*
    assumed request data {slug , name ,permissions,role_id}
  */

  router.post('/update_role',(req,res,next)=>{
    conn.query(`update Roles set Slug = "${req.body.slug}" , Name = "${req.body.name} ", permissions = "${req.body.permissions}" where role_id == ${req.body.role_id} `)
    .then(result => {
      console.log(result);
      res.json({status : 200 , result : "success"})
    })
    .catch(err=>{
      console.log(err);
      res.json({staus : 500 , result : "some internal server error occured" , error_detail : err});
    })
  });

  /*
    assumed request data {slug , name , http_method , http_path}
  */

  router.post('/add_permission',(req,res,next)=>{
    var perm_id;
    conn.query('select * from counter')
    .then(result => {
      console.log(result[0]);
      perm_id = result[0].perm_id;
      return conn.query(`insert into Permissions (Slug , Name , Http_method , Http_path , permission_id) values ("${req.body.slug}" , "${req.body.name}" , "${req.body.http_method}" , "${req.body.http_path} ", ${perm_id+1})`);
    })
    .then(result=>{
      console.log(result);
      return conn.query(`update counter set perm_id = ${perm_id+1}`);
    })
    .then(result => {
      console.log(result);
      res.json({status : 200 , result : "success"});
    })
    .catch(err=>{
      console.log(err);
      res.json({staus : 500 , result : "some internal server error occured" , error_detail : err});
    })
  });

  /*
    assumed request data {permission_id}
  */

  router.get('/remove_permission/:id',(req,res,next)=>{
    conn.query(`delete from Permissions where permission_id = ${req.params.id}`)
    .then(result => {
      console.log(result);
      res.json({status : 200 , result : "success"})
    })
    .catch(err=>{
      console.log(err);
      res.json({staus : 500 , result : "some internal server error occured" , error_detail : err});
    })
  });

  /*
    assumed request data {slug , name , http_method , http_path, permission_id}
  */

  router.post('/update_permission',()=>{
    conn.query(`update Permissions set Slug = "${req.body.slug}" , Name = "${req.body.name}" , Http_method = "${req.body.http_method} ", Http_path = "${req.body.http_path}" where permission_id == ${req.body.permission_id} `)
    .then(result => {
      console.log(result);
      res.json({status : 200 , result : "success"})
    })
    .catch(err=>{
      console.log(err);
      res.json({staus : 500 , result : "some internal server error occured" , error_detail : err});
    })
  });

})
.catch(err=>{
  console.log(err);
});

module.exports = router;

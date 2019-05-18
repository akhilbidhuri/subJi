const conn = require('../../db/mysql')
const uuidv1 = require('uuid/v1');
const moment = require('moment');
const {payment, getPlanCost, getCurrentCost} = require('../requiredmethods')
/*This controller is for upgrading if the user dosen't exist a new user record is inserted
and the plan details are also inserted.
If the user exists then in the database the plan is upgraded and the call is made to the payment API if needed.
*/
var updowngrade = (req, res) =>{
  let name = req.body.user_name
  let start_date = req.body.start_date
  let plan = req.body.plan
  conn.query('select * from users where name=?', name, function (err, result) {
    if(err) {
      console.log(err)
      res.send({status:'FAILED',msg:'err failed some error occured'})
    }
    if(result.length === 0){
      let uid = uuidv1();
      conn.query("INSERT INTO users(uid, name) VALUES(?, ?)", [uid, name], function(err, result){
        if(err) {
          console.log(err)
          res.send({status:'FAILED', msg:'err failed some error occured'})
        }
        getPlanCost(plan)
        .then((resp)=>
         payment(name, "DEBIT", resp)
        )
        .then((resp)=>
        conn.query("INSERT INTO userplans(uid, pid, startdate, active) VALUES(?, ?, ?, ?)", [uid, plan, start_date, true], function(err, result){
          if(err) {
            console.log(err)
            res.send({status:'FAILED',msg:'err failed some error occured'})
          }
          res.send({status:'SUCCESS', msg:'New User was created and plan was inserted'})
        }))
        .catch(err=>
          res.send({status:'FAILED', msg:'Failed in Payment or Database'}))
    })}
    else{
      let plancost;
      getPlanCost(plan)
      .then((cost)=>{
        plancost = cost;
        getCurrentCost(result[0].uid, start_date)
      .then((resp)=>
      payment(name, resp-plancost<0?'DEBIT':'CREDIT', Math.abs(resp-plancost))
      )
      .then((resp)=>{
        conn.query('UPDATE userplans set active=false where uid = ? and active=true', result[0].uid, function(err, data){
          if(err) {
            console.log(err)
            res.send({msg:'err failed some error occured'})
          }
          conn.query("INSERT INTO userplans(uid, pid, startdate, active) VALUES(?, ?, ?, ?)", [result[0].uid, plan, start_date, true], function(err, result){
            if(err) {
              console.log(err)
              res.send({msg:'err failed some error occured'})
            }
            //console.log("updated plan")
            res.send({status:'SUCCESS',msg:'plan Changed'})
          })
        })
      })
      .catch((err)=>{
        console.log(err)
        //console.log("phat gaya")
        res.send({status:'FAILED',msg:'FAILED'})
      })
    }).catch((err)=>{
      console.log(err)
      //console.log("phat gaya")
      res.send({status:'FAILED',msg:'FAILED'})
    })
    }
  })  
}
/*
This controller retrieves plan data closest to the given date.
If date is not specified it returns all the plans user had.
It returns remaining days in both the conditions of the active plan.
*/
var retrieve = (req, res) =>{
  let name = req.body.user_name;
  let date;
  if(req.body.time_stamp)
  date = req.body.time_stamp;
  conn.query('SELECT * FROM users where name=?', name, function(err, result){
    if(err){
      res.send({status:'Failed'})
    }
    if(result.length === 0){
      res.send({status:'Failed', msg:'User dosent exist'})
    }
    else{
      if(date){
      conn.query('SELECT * FROM userplans where uid=? and startdate<=? order by startdate limit 1', [result[0].uid, date], 
      function(err, results){
        if(err){
          res.send({status:'Failed'})
        }
        if(results.length === 0){
          res.send({status:'Failed', msg:'Plans dosent exist'})
        }
          conn.query('SELECT * FROM userplans where uid=? and active=true', result[0].uid,
          function(err, result){
            if(err){
              res.send({status:'Failed'})
            }
            let start = moment(result[0].startdate)
            console.log('start date:', start)
            let noofdays;
            if(result[0].pid ==='FREE')
            noofdays = 'infinity';
            else{
              let enddate;
              if(result[0].pid==='TRIAL')
              enddate = moment(start).add(7, 'D');
              else if(result[0].pid.search('1')>0){
                enddate = moment(start).add(1, 'M');
              }
              else if(result[0].pid.search('6')>0)
                enddate = moment(start).add(6, 'M');
              //console.log('ending date', enddate)
              noofdays = moment(enddate).diff(moment(), 'days');
              }
          res.send({status:'SUCCESS', plandata: result[0], remaining_days: noofdays}) 
        })
        })
    }
    else{
      conn.query('SELECT * FROM userplans where uid=? ', result[0].uid, 
      function(err, result){
        if(err){
          res.send({status:'Failed'})
        }
        if(result.length === 0){
          res.send({status:'Failed', msg:'Plans dosent exist'})
        }
        let r=[];
        for(let i=0;i<result.length;i++)
        r.push(result[i])
        conn.query('SELECT * FROM userplans where uid=? and active=true', result[0].uid,
        function(err, result){
          if(err){
            res.send({status:'Failed'})
          }
          let start = moment(result[0].startdate)
          let noofdays;
          if(result[0].pid ==='FREE')
          noofdays = 'infinity';
          else{
            let enddate;
            if(result[0].pid==='TRIAL')
            enddate = moment(start).add(7, 'D');
            else if(result[0].pid.search('1')>0){
              enddate = moment(start).add(1, 'M');
            }
            else if(result[0].pid.search('6')>0)
              enddate = moment(start).add(6, 'M');
            noofdays = moment(enddate).diff(moment(), 'days');
            }
          res.send({status:'SUCCESS', plandata: r, remaining_days: noofdays}) 
        })   
      })
    }
  }
  })
}
module.exports = {
  updowngrade,
  retrieve
};
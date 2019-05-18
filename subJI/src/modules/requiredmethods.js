const request = require('request')
const conn = require('../db/mysql')
const moment = require('moment')
let payment = ( user_name, payment_type, amount) => {
    return new Promise(
        (resolve, reject)=>{
            console.log(user_name, payment_type, amount);
            request.post({
                url:"http://localhost:3000/payment", 
                headers:{'content-type': 'application/json'},
                body:JSON.stringify({"user_name": user_name,"payment_type": payment_type,"amount": amount})
            },
            (error, response, data)=>{
                if(error) reject(error);
                resolve(data);
            })
        }
    )
}

let getPlanCost = (pid) => {
    return new Promise((resolve, reject)=>{
        conn.query('SELECT cost FROM plans WHERE id=?', pid, function(err, result){
            if(err){
                console.log("Failed to get Cost")
                reject(err)
            }
            console.log('Plan cost:',result[0].cost)
            resolve(result[0].cost)
        })
    })
}

let getCurrentCost = (uid, date) => {
    return new Promise((resolve, reject)=>{
    conn.query('SELECT * FROM userplans WHERE uid=? and active=true', uid, function(err, result){
        if(err){
            //console.log("Failed to get PLAN")
            reject(err)
        }
        conn.query('SELECT * FROM plans WHERE id=?', result[0].pid, function(err, results){
            if(err){
                console.log("Failed to get Cost")
                reject(err)
            }
            //console.log('got the current cost', results[0].cost)
            let costperday;
            if(results[0].validity)
            costperday = results[0].cost/results[0].validity;
            else resolve(0)
            date = moment(date);
            let startdate = moment(result[0].startdate)
            let daysused = date.diff(startdate, 'days')
            console.log('days used:', daysused)
            resolve(results[0].cost-daysused*costperday)   
        })
    })
    })
}

module.exports = {
    payment,
    getPlanCost,
    getCurrentCost
}
module.export = {
    insertUser: "INSERT INTO users(name) VALUES(?)",
    insertPlan: "INSERT INTO userplans(uid, pid, startdate, active) VALUES(?,?)",
    updatePlan: "UPDATE userplans set active=false where uid = ? and active=true"
};
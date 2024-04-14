import express, { Express} from "express";
import groups from './assets/groups.json';
import leaders from './assets/leaders.json';
import {Group,Leader} from './interfaces'

const groupsArray : Group[] = [];
for(let i = 0; i<groups.length;i++){
    groupsArray.push(groups[i])
}
const leaderArray : Leader[] = [];
    for(let i = 0; i<leaders.length;i++){
        leaderArray.push(leaders[i])
    }

const app = express();
app.set("port", 3000);
app.set("view engine", "ejs");

app.get('/',(req,res) => {
    res.type('text/html');
    res.status(200);
    res.render('index', {groups:groupsArray})
})

app.get('/groups',(req,res) => {
res.type('text/html');
res.status(200);
res.render('groups', {groups:groupsArray, q:""})
})

app.get('/groups/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const group = groupsArray.find((group) => group.id === id);
    
    if(group){
        res.type('text/html');
        res.status(200);
        res.render('group', {group:group})
    }else{
        res.type('text/html');
        res.status(404);
        res.send("Group not found")
    }
})

app.get('/search',(req,res) => {
    let q : string = typeof req.query.q == 'string' ? req.query.q : "";
    let filteredGroups : Group[] = groups.filter((group) => { 
        return group.name.toLowerCase().startsWith(q.toLowerCase())});
        res.type('text/html');
        res.status(200);
        res.render('groups', {groups:filteredGroups, q:q})
})


app.get('/leaders',(req,res) => {
    
    res.type('text/html');
    res.status(200);
    res.render('leaders', {leaders:leaderArray})
})

app.get('/leaders/:id', (req,res) => {
    const id = parseInt(req.params.id);
    const leader = leaderArray.find((leader) => leader.id === id);
    
    if(leader){
        res.type('text/html');
        res.status(200);
        res.render('leader', {leader:leader})
    }else{
        res.type('text/html');
        res.status(404);
        res.send("Leader not found")
    }
})

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});
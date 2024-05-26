import express, { Express} from "express";
import {Supportgroup,Leader,User} from './interfaces';
import {connect, getGroups, getGroupByID, getLeaderByID, getLeaders, searchGroups, updateGroup, login} from './database';

const groupsArray : Promise<Supportgroup[]> = getGroups();
console.log(groupsArray);
const leaderArray : Promise<Leader[]> = getLeaders();
console.log(leaderArray);

const app = express();
app.set("port", 3000);
app.set("view engine", "ejs");
app.use(express.static('public'));

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
    const group = getGroupByID(id);
    
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
    let filteredGroups : Promise<Supportgroup[]> = searchGroups(q, groupsArray);
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
    const leader = getLeaderByID(id);
    
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

app.post('/groups/:id/update', (req,res) => {

    const id = parseInt(req.params.id);
    const name = req.body.name;
    const description = req.body.description;
    const status = req.body.status;
    const isRemote = req.body.isRemote;

    updateGroup(id, name, description, status, isRemote);

    res.redirect('/groups/' + id);
})

app.get('/login',(req,res) => {
    res.type('text/html');
    res.status(200);
    res.render('login')
})
 
app.post('/login', async (req,res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        let user: User = await login(email, password);
        req.session.user = user;
        req.session.message = { type: "success", message: "Login successful" };
        res.redirect("/")
    } catch (e: any) {
        req.session.message = { type: "error", message: e.message };
        res.redirect('/login');
    }
});

app.listen(app.get("port"), async() => {
    await connect();
    console.log("Server started on http://localhost:" + app.get('port'));
});
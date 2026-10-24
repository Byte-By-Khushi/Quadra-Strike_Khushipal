const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;
const DATA = path.join(__dirname, 'data.json');
app.use(cors());
app.use(express.json());

const initialEvents = [
  {id:1,title:'Mumbai Tech & AI Meetup',category:'Technology',city:'Mumbai',venue:'Andheri Innovation Hub',date:'2026-11-08',time:'10:30 AM',price:0,description:'Meet builders, students and developers for short talks and networking.',tags:['AI','Technology','Networking'],organizer:'Mumbai Tech Community',verified:true},
  {id:2,title:'Indie Music Evening',category:'Music',city:'Thane',venue:'Lakeview Amphitheatre',date:'2026-11-12',time:'6:00 PM',price:299,description:'An open-air evening featuring local independent musicians.',tags:['Music','Live','Outdoor'],organizer:'Local Sounds',verified:true},
  {id:3,title:'Design Thinking Workshop',category:'Workshop',city:'Mumbai',venue:'Bandra Co-work Studio',date:'2026-11-15',time:'11:00 AM',price:149,description:'A practical beginner-friendly workshop to turn problems into ideas.',tags:['Design','Learning','Students'],organizer:'Create Lab',verified:false},
  {id:4,title:'Community Beach Clean-up',category:'Community',city:'Mumbai',venue:'Juhu Beach Entrance 5',date:'2026-11-09',time:'7:00 AM',price:0,description:'Join local volunteers for a community clean-up and awareness drive.',tags:['Community','Volunteering','Outdoor'],organizer:'Green Neighbourhood',verified:true},
  {id:5,title:'Startup Stories: Student Edition',category:'Business',city:'Navi Mumbai',venue:'Vashi Learning Centre',date:'2026-11-20',time:'2:00 PM',price:99,description:'Student founders share lessons from building their first projects.',tags:['Startup','Students','Networking'],organizer:'Founders Circle',verified:false},
  {id:6,title:'Weekend Photography Walk',category:'Art',city:'Thane',venue:'Upvan Lake Meeting Point',date:'2026-11-22',time:'7:30 AM',price:0,description:'A relaxed photo walk for beginners. Bring any phone or camera.',tags:['Photography','Art','Outdoor'],organizer:'Frame Friends',verified:true}
];
function load(){try{return JSON.parse(fs.readFileSync(DATA,'utf8'))}catch{return {events:initialEvents, rsvps:[]}}}
function save(db){fs.writeFileSync(DATA,JSON.stringify(db,null,2))}
if(!fs.existsSync(DATA)) save({events:initialEvents,rsvps:[]});
app.get('/api/health',(req,res)=>res.json({ok:true,app:'EVENTORA API'}));
app.get('/api/stats',(req,res)=>{const db=load();res.json({eventCount:db.events.length,rsvpCount:db.rsvps.length,cityCount:new Set(db.events.map(e=>e.city)).size,freeEventCount:db.events.filter(e=>Number(e.price)===0).length,verifiedCount:db.events.filter(e=>e.verified).length});});
app.get('/api/events',(req,res)=>{
 const db=load(); let list=db.events;
 const {q,city,category,date,free}=req.query;
 if(q) list=list.filter(e=>(e.title+' '+e.description+' '+e.tags.join(' ')).toLowerCase().includes(q.toLowerCase()));
 if(city && city!=='All cities') list=list.filter(e=>e.city.toLowerCase()===city.toLowerCase());
 if(category && category!=='All categories') list=list.filter(e=>e.category===category);
 if(date) list=list.filter(e=>e.date===date);
 if(free==='true') list=list.filter(e=>Number(e.price)===0);
 res.json(list);
});
app.get('/api/events/:id',(req,res)=>{const e=load().events.find(x=>x.id===Number(req.params.id)); if(!e)return res.status(404).json({error:'Event not found'});res.json(e)});
app.post('/api/events',(req,res)=>{
 const {title,category,city,venue,date,time,price,description,organizer,tags}=req.body;
 if(!title||!category||!city||!venue||!date) return res.status(400).json({error:'Please provide title, category, city, venue and date.'});
 const db=load(); const event={id:Date.now(),title,category,city,venue,date,time:time||'To be announced',price:Number(price)||0,description:description||'',organizer:organizer||'Community Organizer',tags:Array.isArray(tags)?tags:[],verified:false}; db.events.unshift(event);save(db);res.status(201).json(event);
});
app.post('/api/rsvp',(req,res)=>{
 const {eventId,name,email}=req.body; if(!eventId||!name||!email)return res.status(400).json({error:'Event, name and email are required.'});
 const db=load();const event=db.events.find(e=>e.id===Number(eventId));if(!event)return res.status(404).json({error:'Event not found'});
 if(db.rsvps.some(r=>r.eventId===Number(eventId)&&r.email.toLowerCase()===email.toLowerCase()))return res.status(409).json({error:'This email already has an RSVP for this event.'});
 const rsvp={id:Date.now(),eventId:Number(eventId),name,email,createdAt:new Date().toISOString()};db.rsvps.push(rsvp);save(db);res.status(201).json({message:'RSVP confirmed!',rsvp});
});
app.get('/api/rsvps',(req,res)=>{const email=String(req.query.email||'').toLowerCase();res.json(load().rsvps.filter(r=>r.email.toLowerCase()===email))});
app.listen(PORT,()=>console.log(`EVENTORA API running at http://localhost:${PORT}`));

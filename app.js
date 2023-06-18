const express=require("express");
const app=express();
const bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
const {MongoClient}=require("mongodb");
const { count } = require("console");
const uri=" ***YOUR MONGODB CONNECTION STRING HERE (BETWEEN DOUBLE QUOTES)*** ";
const client=new MongoClient(uri);
app.set("view engine","ejs");
app.use(express.static('public'));

var num=0;
var arr=[];
var arr2=[];
var final=[];
var xyz=[];
var sum=0;
var ab=0;

app.get("/",async(req,res)=>{
    arr2=[];
    num=0;
    ab=0;
    // sum=0;
    await client.connect();
    const db=client.db("fruits");
    const doc=db.collection("cart");
    const doc2=db.collection("user");
    const f=doc.find();
    arr=await f.toArray();
    // arr.forEach((e)=>{
    //     num+=Number(e.count);
    //     // sum+=Number(e.price);
    // })
    const fetch=doc2.find();
    arr2=await fetch.toArray();
    arr2.forEach((e)=>{
        num+=Number(e.count);

    })
     res.render("main",{data:arr,data2:arr,price:ab,qu:arr2,crt:num});

})

app.get("/cart",async(req,res)=>{
    arr2=[];
    ab=0;
    xyz=[];
    final=[];
    const db=client.db("fruits");
    const doc2=db.collection("user");
    const fetch=doc2.find();
    arr2=await fetch.toArray();
    xyz=arr;
    arr2.forEach((e)=>{
       for(var i=0;i<arr.length;i++){
            if(e._id===arr[i]._id){
                xyz[i].count=e.count;
                 final.push(xyz[i]);
                 ab+=(Number(xyz[i].price)*Number(e.count));
            }
        }
        
    })
 
    res.render("cart",{data:arr,data2:final,price:ab,crt:num});
})

app.post("/",async (req,res)=>{
    
    var id=req.body.name;
    console.log(id);
    const db=client.db("fruits");
    // const doc=db.collection("user");
    // const f=await doc.findOne({_id:id});
    // const u=await doc.updateOne({_id:id},{$set:{count:Number(f.count)+1}});
    const doc2=db.collection("user");
    const  u2=await doc2.updateOne({_id:id},{$inc:{count:1}},{upsert:true});
    res.redirect("/");
})

app.post("/cart",async(req,res)=>{
    remID=req.body.rem;
    const db=client.db("fruits");
    const doc2=db.collection("user");
    const f=await doc2.findOne({_id:remID});
    console.log(f);
    num=num-Number(f.count);
    await doc2.deleteOne({_id:remID});
    
    res.redirect("/cart");
})


app.listen(3000,()=>{
    console.log("server up!!");
})
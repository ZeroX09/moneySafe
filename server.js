const express = require("express");
const app = express()
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("successful")
}).catch(e=>{
    console.log(e)
})
app.use(require("cors")({origin:"*"}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const schema = new mongoose.Schema({
    sale:{type:String,required:true},
    price:{type:String,required:true},
});

const Safe = mongoose.model("money",schema);
const schema2 = new mongoose.Schema({
    total:Number,
});

const Config = mongoose.model("config",schema2);


app.post("/money",async(req,res)=>{
    try{

    if(!req.body){
        return res.status(304).json({error:"request is invalid"});
    }

    let doc = await Safe.insertMany(req.body.map((item)=>{return{sale:item.sale,price:item.price}}))

    res.json({complete:true})
}

catch(e){
    res.status(404).json({error:"Error Happend"})

}
})

app.delete("/money",async(req,res)=>{
    try{

    if(!req.body){
        return res.status(304).json({error:"request is invalid"});
    }

    let doc = await Safe.deleteMany({_id:{$in:req.body}})

    res.json({complete:true})
}

catch(e){
    res.status(404).json({error:"Error Happend"})

}
})
app.get("/money",async(req,res)=>{
    try{

    const Money = await Safe.find({})
    res.json(Money);
}catch(e){
    res.status(404).json({error:"Error Happend"})
}

})

app.post("/config",(req,res)=>{
    try {
        let body =req.body.total;
        Config.create({
            total,
        })
        res.json({complete:true})
    } catch (error) {
        res.status(404).json({error})
    }
})

app.get("/config",async (req,res)=>{
    try {
       let data= await Config.find().limit(1);
       res.json(data[0]);
    } catch (error) {
        res.status(404).json({error})
    }
})
app.put("/config",async (req,res)=>{
    try {
       let data= await Config.findOneAndUpdate({_id:req.body.id},{$set:{total:req.body.total}});
       res.json({complete:true});
    } catch (error) {

        res.status(404).json({error})
    }
})
app.listen(process.env.PORT);
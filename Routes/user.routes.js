const {UserModel}=require("../Models/user.models")
const {AssignedModel}=require("../Models/courses.models")
const {auth}=require("../Middlewares/auth")
const {Router}=require("express")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
const userRouter=Router()

userRouter.post("/register",async(req,res)=>{
    const {name,email,age,password,role}=req.body
    
    try{
        const finduser=await UserModel.findOne({email})
        if(finduser){
            if(role=="admin"){
                res.status(200).send({message:"Admin already Registered Please Login"})
            }else if(role=="instructor"){
                res.status(200).send({message:"Instructor already Registered Please Login"})
            }
        }else{
            bcrypt.hash(password,5,async(err,hash)=>{
                const user=UserModel({name,email,age,password:hash,role})
                await user.save()
                if(role=="admin"){
                    res.status(200).send({message:"Admin Registered Successfully"})
                }else if(role=="instructor"){
                    res.status(200).send({message:"Instructor Registered Successfully"})
                }
                
            })
        }
    }catch(er){
        res.status(401).send({message:er.message})
    }
})


userRouter.get("/getinstructors",async(req,res)=>{
    try{
const instructor=await UserModel.find()
res.status(200).send({message:"Instructor Fetched Successfully",data:instructor})
    }catch(error){
res.status(401).send({message:error.message})
    }
})


userRouter.get("/assigned/:id",auth,async(req,res)=>{
    const {id}=req.params
    try{
const instructor=await AssignedModel.find({instructorId:id})
res.status(200).send({message:"Instructor Fetched Successfully",data:instructor})
    }catch(error){
res.status(401).send({message:error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const finduser=await UserModel.findOne({email})
        if(finduser){
            bcrypt.compare(password, finduser.password,(err,result)=>{
                if(result){
                    if(finduser.role=="admin"){
                        const token=jwt.sign({admin:finduser.name,adminId:finduser._id,role:finduser.role},"user");
                        res.status(200).send({message:"Login Successfully","token":token,role:"admin",admin:finduser})
                    }else if(finduser.role=="instructor"){
                        const token=jwt.sign({instructor:finduser.name,instructorId:finduser._id,role:finduser.role},"user");
                        res.status(200).send({message:"Login Successfully","token":token,role:"instructor",instructor:finduser})
                    }
                   
                }else{
                    res.status(200).send({message:"Wrong Credential"}) 
                }
            })
        }else{
            res.status(200).send({message:"Wrong Credential"}) 
        }
    }catch(er){
        res.status(401).send({message:er.message}) 
    }
})

module.exports={
    userRouter
}
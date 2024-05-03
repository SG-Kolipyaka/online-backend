const jwt=require("jsonwebtoken")

const auth=(req,res,next)=>{
    const token=req.headers.authorization
    if(token){
        try{
            const decode=jwt.verify(token,"user")
            if(decode){
if(decode.role=="admin"){
    req.body.admin=decode.admin
    req.body.adminId=decode.adminId
    req.body.role=decode.role
    next()
}else if(decode.role=="instructor"){
    req.body.instructor=decode.instructor
    req.body.instructorId=decode.instructorId
    req.body.role=decode.role
    next()
}
            }else{
                res.status(200).send({"msg":"Please Login"}) 
            }
        }catch(er){
            res.status(200).send({"msg":er.message}) 
        }
    }else{
        res.status(200).send({"msg":"Please Login"}) 
    }
}


module.exports={
    auth
}
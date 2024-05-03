const {AssignedModel,CourseModel}=require("../Models/courses.models")
const {auth}=require("../Middlewares/auth")
const {Router}=require("express")
const courseRouter=Router()


courseRouter.post("/assignlectures",auth, async (req, res) => {
    try {
        const { instructorId, date ,role} = req.body;
if(role=="admin"){
    const existingAssignment = await AssignedModel.findOne({ instructorId, date });
    if (existingAssignment) {
        res.status(400).send({ message: "The instructor is already assigned a lecture for the selected date. Please select a different date or a different instructor." });
    } else {
        const newAssignment = new AssignedModel(req.body);
        await newAssignment.save();
        res.status(200).send({ message: "Lecture assigned successfully." });
    }
}else{
    res.status(200).send({ message: "You are not allowed to assign the lectures as you are not admin" });
}
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


courseRouter.get("/getassigned",auth,async(req,res)=>{
    try{
        const { role} = req.body;
        if(role=="admin"){
            const lectures =await AssignedModel.find()
            res.status(200).send({message:"Data Fetched Successfully", data:lectures})
        }else{
            res.status(200).send({message:"as you are not admin you dont have access"})
        }
    }catch(error){
res.status(401).send({message:error.message})
    }
})

courseRouter.post("/addcourses",auth,async(req,res)=>{
    const {name,role}=req.body
    try{
       if(role!=="instructor"){
        const existingcourse = await CourseModel.findOne({ name });
        if (existingcourse) {
            res.status(400).send({ message: "Course With the name already exists" });
        } else {
            const newCourse = new CourseModel(req.body);
            await newCourse.save();
            res.status(200).send({ message: "Course Added Successfully" ,data:newCourse});
        }
       }else{
        res.status(200).send({ message: "You Have Logged in as instructor so you cannot add the Course"});
       }

    }catch(error){

    }
})




courseRouter.get("/getcourses",auth,async(req,res)=>{
    const {role}=req.body
    try{
if(role=="admin"){
    const courses=await CourseModel.find()
res.status(200).send(courses)
}else{
    res.status(200).send({message:"You are instructor so you dont have the access to this route"})  
}
    }catch(error){
res.status(401).send({error:error.message})
    }
})


module.exports={
    courseRouter
}
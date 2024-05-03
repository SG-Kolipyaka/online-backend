const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    admin: { type: String },
    adminId: { type: String },
    lecture: [{ type: String }]
}, {
    versionKey: false
});

const CourseModel = mongoose.model("Course", CourseSchema);


const AssignedSchema = mongoose.Schema({
    name: { type: String },
    instructor: { type: String },
    instructorId: { type: String },
    lecture: { type: String },
    date: { type: Date } 
}, {
    versionKey: false
});

const AssignedModel = mongoose.model("assigned", AssignedSchema);

module.exports = {
    CourseModel,
    AssignedModel
};

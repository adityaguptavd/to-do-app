import mongoose from "mongoose";

// schema for task
const taskSchema = new mongoose.Schema({
    task : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref : 'user'
    }
});

// model the task schema and export
const Task = mongoose.model('task', taskSchema);
export default Task;
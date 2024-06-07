import mongoose from "mongoose";



const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    height:{type: Number},
    weight:{type: Number},
    old:{type:Number},
    gender:{ type: String, enum: ['zenska', 'meska']},
    activitylvl:{type: Number, enum: [1,2,3,4,5,6]},
    targetD:{type:Number,enum:[1,2,3]},
    proteinDemand:{type:Number},
    carboDemand:{type:Number},
    fatDemand:{type:Number},
    kcalDemand:{type:Number}
});

export default mongoose.model('User', userSchema);

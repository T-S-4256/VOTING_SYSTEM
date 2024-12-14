const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    age: {
        type: Number,
        require: true
    },
    email: {
        type: String,
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        require: true
    },
    aadharNumber: {
        type: Number,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});


//USING PRE MIDDLEWARE TO HASH THE PASSWORD WHEN WE WANT TO DO CHANGES IN PASSWORD 
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next();

    }
    catch (err) {
        throw (err);
    }
})


////FUNCTION TO COMPARE PASSWORD
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        const isMatched = await bcrypt.compare(userPassword, this.password);
        return isMatched;
    }
    catch (err) {
        console.log("Internal Server Error : ", err)
        res.status(500).json({ err: "Internal Server Error" });
    }

}







const User = mongoose.model('User', userSchema);
module.exports = User;
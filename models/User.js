const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,    // space를 없애주는 역할
        unique: 1
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});

userSchema.pre('save', function( next ) {
    let user = this;

    if(user.isModified('password')) {
        
        //비밀번호 암호화.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
            
        })
    }
})
const User = mongoose.model('User', userSchema);

module.exports = { User };
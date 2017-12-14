'use strict';

const crypto = require('crypto');
const db = require('../../services/db').db;

const Schema = db.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
    name: {
        first: { type: String, required: true },
        last: { type: String, required: true }
    },
    username: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    profilePic: String,
    hobbies: [String],
    fbToken: String,
    education: [{ type: Schema.Types.ObjectId, ref: 'organizations' }],
    work: [{ type: Schema.Types.ObjectId, ref: 'organizations' }]
});

userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    user.password = crypto.createHash('md5').update(user.password).digest("hex");
    return next();
});

module.exports = db.model('users', userSchema);
'use strict';

const db = require('../../services/db').db;

const Schema = db.Schema;
const ObjectId = Schema.ObjectId;

const orgSchema = new Schema({
    name: { type: String, required: true },
    start: { type: Date, required: true },
    end: Date,
    present: Boolean
});

module.exports = db.model('organizations', orgSchema);
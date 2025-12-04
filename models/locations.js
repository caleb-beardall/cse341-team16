// locations.js - Rick Shaw

const mongoose = require('mongoose');

const TYPE_OPTIONS = [
    'hall',
    'church',
    'park',
    'hotel',
    'conference center',
    'banquet hall',
    'other'
];

const RECOMMENDED_FOR_OPTIONS = [
    'wedding',
    'banquet',
    'dance',
    'conference',
    'meeting',
    'party',
    'other'
];

const locationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        type: {   // example: 'hall', 'church', 'park', etc.
            type: String,
            trim: true, 
            required: true,
            enum: TYPE_OPTIONS,  // added stricter validation for week 6
        },
        address: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        stateOrProvince: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        recommendedFor: [   // things such as ['wedding', 'banquet'] etc
            {
                type: String,
                enum: RECOMMENDED_FOR_OPTIONS,
            },
        ],
    },
    {
        timestamps: true,  // add a created at or updated at timestamp
    }
);

module.exports = mongoose.model('Location', locationSchema);
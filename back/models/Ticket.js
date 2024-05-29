const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ['Low', 'Mid', 'High'],
        default: 'Low'
    }
}, { timestamps: true });

const Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;
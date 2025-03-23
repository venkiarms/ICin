const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketPrice: Number,
});

module.exports = mongoose.model('TicketPrice', ticketSchema);

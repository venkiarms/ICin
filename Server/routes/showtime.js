const express = require('express');
const Showtime = require('../models/Showtime');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
    addShowtime,
    getShowtime,
    deleteShowtime,
    purchase,
    deletePreviousShowtime,
    getShowtimes,
    deleteShowtimes,
    getShowtimeWithUser,
    getUnreleasedShowtimes,
    updateShowtime,
    deleteTicket
} = require('../controllers/showtimeController');

router.get('/occupancy', protect, authorize('admin'), async (req, res) => {
    const { period } = req.query;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(period));

    try {
        const occupancyData = await Showtime.aggregate([
            { $match: { showtime: { $gte: startDate, $lte: endDate } } },
            { $unwind: "$seats" },
            { $group: { _id: { movie: "$movie", theater: "$theater" }, totalSeatsSold: { $sum: 1 } } },
            { $lookup: { from: "movies", localField: "_id.movie", foreignField: "_id", as: "movieInfo" } },
            { $unwind: "$movieInfo" },
            { $lookup: { from: "theaters", localField: "_id.theater", foreignField: "_id", as: "theaterInfo" } },
            { $unwind: "$theaterInfo" },
            { $lookup: { from: "cinemas", localField: "theaterInfo.cinema", foreignField: "_id", as: "cinemaInfo" } },
            { $unwind: "$cinemaInfo" },
            { $project: {
                _id: 0, 
                movie: "$movieInfo.name", 
                theater: "$cinemaInfo.name",
                location: "$cinemaInfo.location", 
                totalSeatsSold: 1 
            } }
        ]);

        res.json({ success: true, data: occupancyData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.route('/deleteTicket/:id').delete(protect,deleteTicket);
router.route('/unreleased').get(protect, authorize('admin'), getUnreleasedShowtimes);
router.route('/previous').delete(protect, authorize('admin'), deletePreviousShowtime);
router.route('/user/:id').get(protect, authorize('admin'), getShowtimeWithUser);

router.route('/')
    .get(getShowtimes)
    .post(protect, authorize('admin'), addShowtime)
    .delete(protect, authorize('admin'), deleteShowtimes);

router.route('/:id')
    .get(getShowtime)
    .post(protect, purchase)
    .put(protect, authorize('admin'), updateShowtime)
    .delete(protect, authorize('admin'), deleteShowtime);

module.exports = router;

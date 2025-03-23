const Movie = require("../models/Movie");
const Showtime = require("../models/Showtime");
const Theater = require("../models/Theater");
const User = require("../models/User");
const SEAT_PRICE = 20;
const SERVICE_FEE = 1.5;

//@desc     GET showtimes
//@route    GET /showtime
//@access   Public
exports.getShowtimes = async (req, res, next) => {
  try {
    const showtimes = await Showtime.find({ isRelease: true })
      .populate([
        "movie",
        {
          path: "theater",
          populate: { path: "cinema", select: "name" },
          select: "number cinema seatPlan",
        },
      ])
      .select("-seats.user -seats.row -seats.number");

    res
      .status(200)
      .json({ success: true, count: showtimes.length, data: showtimes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     GET showtimes with all unreleased showtime
//@route    GET /showtime/unreleased
//@access   Private admin
exports.getUnreleasedShowtimes = async (req, res, next) => {
  try {
    const showtimes = await Showtime.find()
      .populate([
        "movie",
        {
          path: "theater",
          populate: { path: "cinema", select: "name" },
          select: "number cinema seatPlan",
        },
      ])
      .select("-seats.user -seats.row -seats.number");

    res
      .status(200)
      .json({ success: true, count: showtimes.length, data: showtimes });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     GET single showtime
//@route    GET /showtime/:id
//@access   Public
exports.getShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate([
        "movie",
        {
          path: "theater",
          populate: { path: "cinema", select: "name" },
          select: "number cinema seatPlan",
        },
      ])
      .select("-seats.user");

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime not found with id of ${req.params.id}`,
      });
    }

    if (!showtime.isRelease) {
      return res
        .status(400)
        .json({ success: false, message: `Showtime is not released` });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     GET single showtime with user
//@route    GET /showtime/user/:id
//@access   Private Admin
exports.getShowtimeWithUser = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate([
      "movie",
      {
        path: "theater",
        populate: { path: "cinema", select: "name" },
        select: "number cinema seatPlan",
      },
      {
        path: "seats",
        populate: { path: "user", select: "username email role" },
      },
    ]);

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Add Showtime
//@route    POST /showtime
//@access   Private
exports.addShowtime = async (req, res, next) => {
  try {
    const {
      movie: movieId,
      showtime: showtimeString,
      theater: theaterId,
      repeat = 1,
      isRelease,
    } = req.body;

    if (repeat > 31 || repeat < 1) {
      return res.status(400).json({
        success: false,
        message: `Repeat is not a valid number between 1 to 31`,
      });
    }

    let showtime = new Date(showtimeString);
    let showtimes = [];
    let showtimeIds = [];

    const theater = await Theater.findById(theaterId);

    if (!theater) {
      return res.status(400).json({
        success: false,
        message: `Theater not found with id of ${req.params.id}`,
      });
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(400).json({
        success: false,
        message: `Movie not found with id of ${movieId}`,
      });
    }

    for (let i = 0; i < repeat; i++) {
      const showtimeDoc = await Showtime.create({
        theater,
        movie: movie._id,
        showtime,
        isRelease,
      });

      showtimeIds.push(showtimeDoc._id);
      showtimes.push(new Date(showtime));
      showtime.setDate(showtime.getDate() + 1);
    }
    theater.showtimes = theater.showtimes.concat(showtimeIds);

    await theater.save();

    res.status(200).json({
      success: true,
      showtimes: showtimes,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Purchase seats
//@route    POST /showtime/:id
//@access   Private

exports.purchase = async (req, res, next) => {
  try {
    const { seats, useRewardPoints, ticketPrice } = req.body;
    const user = req.user;
    const isPremiumUser = user.membership === "Premium";

    const showtime = await Showtime.findById(req.params.id).populate({
      path: "theater",
      select: "seatPlan",
    });

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime not found with id of ${req.params.id}`,
      });
    }

    const isSeatValid = seats.every((seatNumber) => {
      const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1);
      const maxRow = showtime.theater.seatPlan.row;
      const maxCol = showtime.theater.seatPlan.column;

      if (maxRow.length !== row.length) {
        return maxRow.length > row.length;
      }

      return maxRow.localeCompare(row) >= 0 && number <= maxCol;
    });

    if (!isSeatValid) {
      return res
        .status(400)
        .json({ success: false, message: "Seat is not valid" });
    }

    const isSeatAvailable = seats.every((seatNumber) => {
      const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1);
      return !showtime.seats.some(
        (seat) => seat.row === row && seat.number === parseInt(number, 10)
      );
    });

    if (!isSeatAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Seat not available" });
    }

    const purchaseAmount = isPremiumUser
      ? seats.length * ticketPrice
      : seats.length * (ticketPrice + SERVICE_FEE);
    let rewardPointsEarned;

    if (useRewardPoints) {
      const rewardPointsRequired = purchaseAmount;

      if (user.rewardPoints < rewardPointsRequired) {
        return res.status(400).json({
          success: false,
          message: "Not enough reward points to make the purchase",
        });
      }

      user.rewardPoints -= rewardPointsRequired;
      rewardPointsEarned = -rewardPointsRequired;
      console.log("payment by points", user.rewardPoints);
    } else {
      const rewardPointsFetched = purchaseAmount;

      user.rewardPoints += rewardPointsFetched;
      rewardPointsEarned = +rewardPointsFetched;

      console.log("payment by cash", user.rewardPoints);
    }
    //await user.save()
    //console.log('reward points',rewardPointsRequired)
    console.log("rewardPointsEarned", rewardPointsEarned);
    const seatUpdates = seats.map((seatNumber) => {
      const [row, number] = seatNumber.match(/([A-Za-z]+)(\d+)/).slice(1);
      return { row, number: parseInt(number, 10), user: user._id };
    });

    showtime.seats.push(...seatUpdates);
    const updatedShowtime = await showtime.save();

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { tickets: { showtime, seats: seatUpdates } },
        $inc: { rewardPoints: rewardPointsEarned },
      },
      { new: true }
    );

    res.status(200).json({ success: true, data: updatedShowtime, updatedUser });
    console.log("user rewards", updatedUser.rewardPoints);
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

//@desc     Update showtime
//@route    PUT /showtime/:id
//@access   Private Admin
exports.updateShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime not found with id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: showtime });
  } catch (err) {
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Delete single showtime
//@route    DELETE /showtime/:id
//@access   Private Admin
exports.deleteShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.findById(req.params.id);

    if (!showtime) {
      return res.status(400).json({
        success: false,
        message: `Showtime not found with id of ${req.params.id}`,
      });
    }

    await showtime.deleteOne();

    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Delete showtimes
//@route    DELETE /showtime
//@access   Private Admin
exports.deleteShowtimes = async (req, res, next) => {
  try {
    const { ids } = req.body;

    let showtimesIds;

    if (!ids) {
      // Delete all showtimes
      showtimesIds = await Showtime.find({}, "_id");
    } else {
      // Find showtimes based on the provided IDs
      showtimesIds = await Showtime.find({ _id: { $in: ids } }, "_id");
    }

    for (const showtimeId of showtimesIds) {
      await showtimeId.deleteOne();
    }

    res.status(200).json({ success: true, count: showtimesIds.length });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Delete previous day showtime
//@route    DELETE /showtime/previous
//@access   Private Admin
exports.deletePreviousShowtime = async (req, res, next) => {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const showtimesIds = await Showtime.find(
      { showtime: { $lt: currentDate } },
      "_id"
    );

    for (const showtimeId of showtimesIds) {
      await showtimeId.deleteOne();
    }

    res.status(200).json({ success: true, count: showtimesIds.length });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err });
  }
};

//@desc     Delete ticket
//@route    DELETE /showtime/deleteTicket/:id
//@access   Public

exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = req.body.ticket;
    const userId = req.body.userId;
    const showtime = await Showtime.findById(ticket.showtime._id);
    const user = await User.findById(userId);
    const seatsToBeCancelled = ticket.seats;
    const isPremiumUser = user.membership === "Premium";
    const userTickets = user.tickets;

    const rewardPointsToBeDeducted = isPremiumUser
      ? seatsToBeCancelled.length * SEAT_PRICE
      : seatsToBeCancelled.length * (SEAT_PRICE + SERVICE_FEE);

    showtime.seats = showtime.seats.filter((showtimeSeat) => {
      return !seatsToBeCancelled.some((cancelledSeat) => {
        return (
          cancelledSeat.row === showtimeSeat.row &&
          cancelledSeat.number === showtimeSeat.number
        );
      });
    }); 
    /* const temp = [];
    for (let i = 0; i < userTickets.length; i++) {
          if(userTickets[i].showtime !== showtime &&
          userTickets[i].seats[0].row !== seatsToBeCancelled[0].row &&
          userTickets[i].seats[0].number !== seatsToBeCancelled[0].number){
          temp.push(userTickets[i]);}
    } */

    const ticketUpdates = [];
    for (let i = 0; i < userTickets.length; i++) {
      let shouldPush = true;
      if (userTickets[i].showtime !== showtime) {
        for (let j = 0; j < userTickets[i].seats.length; j++) {
          for (let k = 0; k < seatsToBeCancelled.length; k++) {
            if (
              userTickets[i].seats[j].row === seatsToBeCancelled[k].row &&
              userTickets[i].seats[j].number === seatsToBeCancelled[k].number
            ) {
              shouldPush = false;
              break;
            }
          }
          if (!shouldPush) break;
        }
      }
      if (shouldPush) ticketUpdates.push(userTickets[i]);
    }

    
    const updatedShowtime = await showtime.save();

     const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: { tickets: ticketUpdates },
        $inc: { rewardPoints: rewardPointsToBeDeducted }
      },
      { new: true }
    );
    //$pull: { tickets: { _id: ticket._id } },

   // res.send(updatedUser);
    //res.status(200).json({ success: true, data: updatedShowtime });
    res.status(200).json({ success: true, data: updatedShowtime, updatedUser, rewardPointsToBeDeducted});
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

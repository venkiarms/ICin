import axios from "axios";
import { useContext, useEffect, useState } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import ShowtimeDetails from "../components/ShowtimeDetails";
import { AuthContext } from "../context/AuthContext";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StarBorderIcon from "@mui/icons-material/StarBorder";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const Tickets = () => {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState({ future: [], past: [] });
  const [rewardPoints, setRewardPoints] = useState(0);
  const [isFetchingticketsDone, setIsFetchingticketsDone] = useState(false);
  const [membership, setMembership] = useState("");
  const [isDeletingTickets, setIsDeletingTickets] = useState(false);
  const [userId, setUserId] = useState("");

  const fetchTickets = async () => {
    try {
      setIsFetchingticketsDone(false);
      const response = await axios.get("/auth/tickets", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      console.log(response.data.data.tickets);

      const now = new Date();
      const thirtyDaysAgo = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - 30
      );

      const futureTickets = response.data.data.tickets.filter((ticket) => {
        const showtimeDate = new Date(ticket.showtime.showtime);
        return showtimeDate > now;
      });

      const pastTickets = response.data.data.tickets.filter((ticket) => {
        const showtimeDate = new Date(ticket.showtime.showtime);
        return showtimeDate <= now && showtimeDate > thirtyDaysAgo;
      });

      futureTickets.sort(
        (a, b) => new Date(a.showtime.showtime) - new Date(b.showtime.showtime)
      );
      pastTickets.sort(
        (a, b) => new Date(b.showtime.showtime) - new Date(a.showtime.showtime)
      );

      setTickets({ future: futureTickets, past: pastTickets });
      setRewardPoints(response.data.data.rewardPoints);
      setMembership(response.data.data.membership);
      setUserId(response.data.data._id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingticketsDone(true);
    }
  };

  const handleDelete = (ticket) => {
    console.log(ticket);
    const confirmed = window.confirm(
      `Do you want to delete cancel this ticket and get a refund?`
    );
    if (confirmed) {
      onCancellation(ticket);
    }
  };

  const onCancellation = async (ticket) => {
    //console.log(ticket);
    try {
      setIsDeletingTickets(true);
      const response = await axios.delete(
        `/showtime/deleteTicket/${ticket.showtime._id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
          data: { ticket, userId },
        }
      );
      //console.log(response.data.rewardPointsToBeDeducted)
      fetchTickets();

      toast.success(
        "Ticket Cancelled and a Refund of $" +
          response.data.rewardPointsToBeDeducted +
          " is issued back",
        {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      setIsDeletingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      <div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-green-200 to-green-100 p-4  sm:mx-8 sm:p-6">
        <div className="mx-4 flex h-fit flex-row gap-4 from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-1 sm:p-2">
          <div className="flex items-center  border-2 border-indigo-900 rounded-md w-1/2 mb-4 ">
            <h2 className="text-3xl font-bold text-gray-900 py-9 px-4">
              Membership Type: {membership}
            </h2>
          </div>
          <div className="flex items-center  border-2 border-indigo-900 rounded-md w-1/2 mb-4 ">
            <h2 className="text-3xl font-bold text-gray-900 py-9 px-4">
              <StarBorderIcon fontSize="large" />
              Reward Points: {rewardPoints}
            </h2>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          <ConfirmationNumberIcon fontSize="large" /> Your Tickets
        </h2>
        {isFetchingticketsDone && tickets.future.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
            {tickets.future.map((ticket, index) => (
              <div className="flex flex-col" key={index}>
                <ShowtimeDetails showtime={ticket.showtime} />
                <div className="flex h-full flex-col justify-center bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
                  <div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
                    <p>Seats :</p>
                    <p className="text-center">
                      {ticket.seats
                        .map((seat) => seat.row + seat.number)
                        .join(", ")}
                    </p>
                    <p className="whitespace-nowrap">
                      ({ticket.seats.length} seats)
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-x-4 px-4 py-2 md:flex-row justify-end">
                    <div className="flex flex-col md:flex-row gap-4">
                      <button
                        className="flex items-center justify-center gap-2 rounded-b-lg  bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-1 font-semibold text-white hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-500 disabled:to-slate-400 md:rounded-none md:rounded-br-lg"
                        onClick={() => handleDelete(ticket)}
                        disabled={isDeletingTickets}
                      >
                        Cancel Ticket
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">You have not purchased any tickets yet</p>
        )}
        <h2 className="text-3xl font-bold text-gray-900">
          History - Past 30 Days
        </h2>
        {isFetchingticketsDone && tickets.past.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 min-[1920px]:grid-cols-3">
            {tickets.past.map((ticket, index) => (
              <div className="flex flex-col" key={index}>
                <ShowtimeDetails showtime={ticket.showtime} />
                <div className="flex h-full flex-col justify-between rounded-b-lg bg-gradient-to-br from-indigo-100 to-white text-center text-lg drop-shadow-lg md:flex-row">
                  <div className="flex h-full flex-col items-center gap-x-4 px-4 py-2 md:flex-row">
                    <p className="whitespace-nowrap font-semibold">Seats : </p>
                    <p className="text-left">
                      {ticket.seats
                        .map((seat) => seat.row + seat.number)
                        .join(", ")}
                    </p>
                    <p className="whitespace-nowrap">
                      ({ticket.seats.length} seats)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No ticket history in the past 30 days.</p>
        )}
        {isFetchingticketsDone ? null : <Loading />}
      </div>
    </div>
  );
};

export default Tickets;

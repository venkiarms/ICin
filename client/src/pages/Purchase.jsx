import { TicketIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import ShowtimeDetails from "../components/ShowtimeDetails";
import { AuthContext } from "../context/AuthContext";
import { GiTicket } from "react-icons/gi";

const Purchase = () => {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const showtime = location.state.showtime;
  const selectedSeats = location.state.selectedSeats || [];
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [membership, setMembership] = useState("");
  const [ticketPrice, setTicketPrice] = useState(20);
  
  const day = new Date(showtime?.showtime).toLocaleString("default", {
    weekday: "long",
  });
  const time = new Date(showtime?.showtime)
    .getHours()
    .toString()
    .padStart(2, "0");
  const isBefore6pm = parseInt(time) < 18;

  const getUser = async () => {
    if (!auth.token) return;
    try {
      const response = await axios.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setRewardPoints(response.data.data.rewardPoints);
      setMembership(response.data.data.membership);
      if (day === "Tuesday" || isBefore6pm) {
        console.log("Tuesday or before 6pm")
        setTicketPrice(ticketPrice-5);
      }
      //console.log(day);
    } catch (error) {
      console.error(error);
    }
  };

  const getTicketPrice = async () => {
    try {
      const response = await axios.get("/auth/getTicketPrice", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setTicketPrice(response.data.data.ticketPrice);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTicketPrice();    
    getUser();
  }, [auth.token]);

  const onPurchase = async () => {
    setIsPurchasing(true);
    try {
      await axios.post(
        `/showtime/${showtime._id}`,
        { seats: selectedSeats, useRewardPoints, ticketPrice },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      navigate("/ticket");
      toast.success("Booking successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <Navbar />
      <div className="container mx-auto mt-4 mb-8 p-4 rounded-lg bg-white shadow-lg">
        <ShowtimeDetails showtime={showtime} />
        {/* ... */}
        {selectedSeats.length > 0 && (
          <div className="mt-4 flex flex-col gap-4 p-4 rounded-lg bg-white shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">
                  Selected Seats: {selectedSeats.join(", ")}
                </p>
                <p className="text-md">({selectedSeats.length} seats)</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold">
                  Tickets Price(${ticketPrice}/ticket): ${selectedSeats.length * ticketPrice}
                </p>
                <div>
                  Service Fee
                  {membership === "Premium"
                    ? "$0"
                    : "($1.5/Ticket): $" + selectedSeats.length * 1.5}
                </div>
                <p className="text-xl">
                  Total: $
                  {membership === "Premium"
                    ? selectedSeats.length * ticketPrice
                    : selectedSeats.length * (ticketPrice + 1.5)}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useRewardPoints}
                  onChange={() => setUseRewardPoints(!useRewardPoints)}
                  className="w-4 h-4 accent-pink-500"
                  disabled={isPurchasing}
                />
                <span className="text-lg font-semibold">
                  Use Reward Points?
                </span>

                <span className="font-medium">
                  Remaining points: ${rewardPoints.toFixed(2)}
                </span>
              </label>
              <button
                onClick={onPurchase}
                className={`px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition duration-300 ease-in-out ${
                  isPurchasing
                    ? "bg-gray-400"
                    : "bg-indigo-700 hover:bg-indigo-600 text-white"
                } `}
                disabled={isPurchasing}
              >
                {isPurchasing ? "Processing..." : "Confirm Booking"}
                <GiTicket className="h-6 w-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Purchase;

import { CheckIcon } from '@heroicons/react/24/outline';
import { memo, useState } from 'react';
import { PiArmchairDuotone } from "react-icons/pi";

const Seat = ({ seat, setSelectedSeats, selectable, selectedSeats, isAvailable, isLimitExceeded }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSeatClick = () => {
    if (!selectable || !isAvailable || (isLimitExceeded && !selectedSeats.includes(`${seat.row}${seat.number}`))) return;
    setIsSelected(!isSelected);
    setSelectedSeats((prevSelectedSeats) => {
      return isSelected
        ? prevSelectedSeats.filter((s) => s !== `${seat.row}${seat.number}`)
        : [...prevSelectedSeats, `${seat.row}${seat.number}`];
    });
  };

  return (
    <PiArmchairDuotone
      title={`${seat.row}${seat.number}`}
      className={`flex items-center justify-center ${!selectable || !isAvailable ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} transform scale-x-[-1] `}
      onClick={handleSeatClick}
      disabled={!isAvailable}
      style={{
        height: '32px',
        width: '32px',
        backgroundColor: isSelected ? 'blue' : 'transparent',
        borderColor: isAvailable ? 'blue' : 'grey',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderRadius: '50%',
        margin: '12px',
        position: 'relative',
        boxShadow: isSelected ? '0 0 10px blue' : 'none',
      }}
    >
      {isSelected && (
        <CheckIcon className="absolute h-5 w-5 text-white" />
      )}
    </PiArmchairDuotone>
  );
};

export default memo(Seat);

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/service/GlobalAPI';
import { PHOTO_REF_URL } from '@/service/GlobalAPI';

function Hotels({ trip }) {
  const [photoUrls, setPhotoUrls] = useState({});

  const parsedTrip = useMemo(() => {
    try {
      if (!trip?.tripData) return null;
      const cleaned = trip.tripData.replace(/^```json\n?|\n?```$/g, '');
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse tripData:", err);
      return null;
    }
  }, [trip]);

  const hotels = parsedTrip?.travelPlan?.hotelOptions;

  useEffect(() => {
    if (hotels?.length) {
      hotels.forEach(hotel => {
        fetchHotelPhoto(hotel.hotelName);
      });
    }
  }, [hotels]);

  const fetchHotelPhoto = async (hotelName) => {
    try {
      const data = { textQuery: hotelName };
      const resp = await GetPlaceDetails(data);
      const photoRef = resp?.data?.places?.[0]?.photos?.[3]?.name;
      if (photoRef) {
        const photoUrl = PHOTO_REF_URL.replace('{NAME}', photoRef);
        setPhotoUrls(prev => ({ ...prev, [hotelName]: photoUrl }));
      }
    } catch (err) {
      console.warn("Photo fetch failed for:", hotelName, err);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {hotels?.length > 0 ? (
          hotels.map((hotel, index) => (
            <Link
              key={hotel.hotelName + hotel.hotelAddress}
              to={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelName + ", " + hotel.hotelAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="mb-4 hover:scale-105 transition-all cursor-pointer">
                <img
                  src={photoUrls[hotel.hotelName]}
                  alt={hotel.hotelName}
                  className="rounded-xl h-[180px] w-full object-cover"
                />
                <div className="my-2 flex flex-col gap-2">
                  <h2 className="font-medium">{hotel.hotelName}</h2>
                  <h2 className="text-xs text-gray-500">📍 {hotel.hotelAddress}</h2>
                  <h2 className="text-sm">💰 {hotel.price}</h2>
                  <h2 className="text-sm">⭐ {hotel.rating}</h2>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-400 mt-2">No hotels available.</p>
        )}
      </div>
    </div>
  );
}

export default Hotels;


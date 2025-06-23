import React, { useMemo, useState, useEffect } from 'react';
import { GetPlaceDetails } from '@/service/GlobalAPI';
import { PHOTO_REF_URL } from '@/service/GlobalAPI';

function PlacesToVisit({ trip }) {
  const [photoUrls, setPhotoUrls] = useState({});

  const parsedTrip = useMemo(() => {
    try {
      if (!trip?.tripData) return null;
      const cleaned = trip.tripData.replace(/^```json\s*|\s*```$/g, '');
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("Failed to parse tripData:", err);
      return null;
    }
  }, [trip]);

  const itinerary = parsedTrip?.travelPlan?.itinerary;

  useEffect(() => {
    const fetchAllPhotos = async () => {
      const allPlaces = [];

      // Collect all unique places
      Object.values(itinerary || {}).forEach((day) => {
        (day?.places || []).forEach((place) => {
          if (place.placeName && !photoUrls[place.placeName]) {
            allPlaces.push(place.placeName);
          }
        });
      });

      for (const placeName of allPlaces) {
        try {
          const resp = await GetPlaceDetails({ textQuery: placeName });
          const photoRef = resp?.data?.places?.[0]?.photos?.[0]?.name;
          if (photoRef) {
            const url = PHOTO_REF_URL.replace('{NAME}', photoRef);
            setPhotoUrls((prev) => ({ ...prev, [placeName]: url }));
          }
        } catch (err) {
          console.warn(`Failed to fetch photo for ${placeName}`, err);
        }
      }
    };

    if (itinerary) fetchAllPhotos();
  }, [itinerary]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <h2 className="font-bold text-lg mt-6">Places To Visit</h2>

      {itinerary ? (
        <div>
          {Object.entries(itinerary).map(([day, details], index) => (
            <div key={index} className="mt-5">
              <h2 className="font-semibold text-xl mb-1">{day.toUpperCase()}</h2>
              <p className="text-sm text-gray-600 italic mb-1">
                <span className="font-medium">Theme:</span> {details?.theme || 'N/A'}
              </p>
              <p className="text-sm text-gray-600 italic mb-2">
                <span className="font-medium text-sm text-orange-600">Best Time to Visit:</span>{' '}
                {details?.bestTimeToVisit || 'N/A'}
              </p>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.isArray(details?.places) ? (
                  details.places.map((place, i) => (
                    <li
                      key={i}
                      className="border p-4 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4 hover:scale-[0.97] transition-all hover:shadow-md cursor-pointer"
                    >
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place?.placeName)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col sm:flex-row gap-4 w-full"
                      >
                        <img
                          src={photoUrls[place.placeName] || '/placeholder.jpg'}
                          alt={place.placeName}
                          className="w-full sm:w-[130px] h-[180px] sm:h-[130px] rounded-xl object-cover"
                        />

                        <div className="flex flex-col justify-between w-full">
                          <div>
                            <h3 className="text-lg font-bold">{place.placeName}</h3>
                            <p className="text-sm text-gray-700">{place.placeDetails}</p>
                          </div>

                          <div className="mt-3 space-y-1 text-sm text-gray-500">
                            <p>
                              🎫 Ticket:{' '}
                              {place.ticketPricing === 0 || place.ticketPricing === 'Free'
                                ? 'Free'
                                : place.ticketPricing}
                            </p>
                            <p>⭐ Rating: {place.rating}</p>
                            <p>🧭 {place.timeTravel}</p>
                          </div>
                        </div>
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">No places listed.</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 mt-2">No itinerary available.</p>
      )}
    </div>
  );
}

export default PlacesToVisit;

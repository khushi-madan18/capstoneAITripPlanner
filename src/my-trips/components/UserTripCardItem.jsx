import React, { useEffect, useState } from 'react';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalAPI';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto(trip.userSelection.location.label);
    }
  }, [trip]);

  const GetPlacePhoto = async (label) => {
    try {
      const data = { textQuery: label };
      const resp = await GetPlaceDetails(data);
      const photoName = resp?.data?.places?.[0]?.photos?.[3]?.name;
      if (photoName) {
        const url = PHOTO_REF_URL.replace('{NAME}', photoName);
        setPhotoUrl(url);
      }
    } catch (error) {
      console.error('Error fetching place photo:', error);
    }
  };

  if (!trip?.userSelection || !trip?.userSelection?.location) {
    return null; // Skip rendering invalid trips
  }

  return (
    <Link to={`/view-trip/${trip?.id || ''}`}>
      <div className='hover:scale-105 transition-all hover:shadow-md'>
        <img
          src={photoUrl || 'https://via.placeholder.com/300x250?text=No+Image'}
          alt='Trip'
          className='w-full h-[250px] object-cover rounded-xl'
        />
        <div className='mt-2'>
          <h2 className='font-bold text-lg'>
            {trip.userSelection.location.label}
          </h2>
          <p className='text-sm text-gray-500'>
            {trip.userSelection.noOfDays} Days trip with {trip.userSelection.budget} Budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;

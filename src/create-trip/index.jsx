import { Input } from "@/components/ui/input";
import React, { useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { SelectbudgetOptions } from "@/constants/options";
import { SelectTravelsList } from "@/constants/options";
import { Button } from "@/components/ui/button";
function CreateTrip() {
    const [place, setPlace] = useState();
    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 '>
            <h2 className='font-bold text-3xl ml-50 mr-50'>Tell us your travel prefernces</h2>
            <p className='mt-3 text-gray-500 text-xl ml-50 mr-50'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className='mt-20 flex flex-col gap-9'>
                <div className="ml-50 mr-50">
                    <h2 className='text-xl my-3 font-medium'>What is your destination?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); console.log(v) }
                        }}
                    />

                </div>
            </div>

            <div className="ml-50 mr-50">
                <h2 className='text-xl my-3 font-medium mt-15'>How many days are you planning your trip for?</h2>
                <Input placeholder={'Ex.3'} type="number" />
            </div>

            <div className="ml-50 mr-50">
                <h2 className='text-xl my-3 font-medium mt-15'>What is Your Budget?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectbudgetOptions.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-lg cursor-pointer">
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="ml-50 mr-50">
                <h2 className='text-xl my-3 font-medium mt-15'>Who do you plan on travelling with on your next Adventure?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectTravelsList.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg hover:shadow-lg cursor-pointer">
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div  className='ml-50 mr-50 my-10 justify-end flex'>
                <Button>Generate Trip</Button>
            </div>
        </div>

    )
}

export default CreateTrip
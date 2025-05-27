import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { AI_PROMPT, SelectbudgetOptions } from "@/constants/options";
import { SelectTravelsList } from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";

function CreateTrip() {
    const [place, setPlace] = useState();

    const [formData, setFormData] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const [loading, setLoading] = useState(false)

    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        console.log(formData)

    }, [formData]);


    const login = useGoogleLogin({
        onSuccess: (codeResp) => GetUserProfile(codeResp),
        onError: (error) => console.log(error),
        flow: 'auth-code',
        windowFeatures: 'scrollbars=yes,resizable=yes,status=no,toolbar=no,menubar=no,width=600,height=600,top=0,left=0,noopener=yes,noreferrer=yes'
    })

    const OnGenerateTrip = async () => {

        const user = localStorage.getItem('user')

        if (!user) {
            setOpenDialog(true)
            return
        }


        if (!formData?.location || !formData?.budget || !formData?.people || !formData?.noOfDays) {
            toast("Please fill all the details.");
            return;
        }

        setLoading(true)

        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{people}', formData?.people)
            .replace('{budget}', formData?.budget);



        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            const response = await model.generateContent([FINAL_PROMPT]);
            console.log(response)
            const result = await response.response.text();
            console.log(result);
            //   const response = await result.response.text();
            //   console.log(response)

            // You can now use this text (parsed JSON) to display trip info
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while generating your trip.");
        }
        setLoading(false)
        SaveAiTrip(result?.response?.text())
    };

    const SaveAiTrip = async (TripData) => {
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('user'));
        const docId = Date.now().toString()
        await setDoc(doc(db, "AITrips", docId), {
            userSelection: formData,
            tripData: JSON.parse(TripData),
            userEmail: user?.email,
            id: docId

        });
        setLoading(false)


    }

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            console.log(resp);
            localStorage.setItem('user', JSON.stringify(resp.data));
            console.log("Closing dialog now");
            setOpenDialog(false);
            OnGenerateTrip();

        })
    }


    return (
        <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 '>
            <h2 className='font-bold text-3xl ml-50 mr-50'>Tell us your travel prefernces🌴🏕️</h2>
            <p className='mt-3 text-gray-500 text-xl ml-50 mr-50'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className='mt-20 flex flex-col gap-9'>
                <div className="ml-50 mr-50">
                    <h2 className='text-xl my-3 font-medium'>What is your destination?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handleInputChange('location', v) }
                        }}
                    />

                </div>
            </div>

            <div className="ml-50 mr-50">
                <h2 className='text-xl my-3 font-medium mt-15'>How many days are you planning your trip for?</h2>
                <Input placeholder={'Ex.3'} type="number" min="0"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                />
            </div>

            <div className="ml-50 mr-50">
                <h2 className='text-xl my-3 font-medium mt-15'>What is Your Budget?</h2>
                <div className="grid grid-cols-3 gap-5 mt-5">
                    {SelectbudgetOptions.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                        ${formData?.budget == item.title && 'shadow-lg border-black'}`}>
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
                        <div key={index}
                            onClick={() => handleInputChange('people', item.people)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                        ${formData?.people == item.people && 'shadow-lg border-black'}`}>
                            <h2 className="text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-lg">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className='ml-50 mr-50 my-10 justify-end flex'>
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip}>
                    {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
                </Button>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>

                <DialogContent>
                    <DialogHeader>
                        
                        <DialogDescription asChild>
                            <div>
                            <h2 className="font-bold text-lg mt-2">Sign In With Google</h2>
                                <p>Sign in to the App with Google Authentication securely.</p>

                                <Button
                                    className="w-full mt-5 flex gap-4 items-center"
                                    onClick={login}
                                >
                                    <FcGoogle className='h-7 w-7' />
                                    Sign In With Google
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>

    )
}

export default CreateTrip
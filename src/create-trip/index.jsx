import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { AI_PROMPT, SelectbudgetOptions, SelectTravelsList } from "@/constants/options";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ChatSession, GoogleGenerativeAI } from "@google/generative-ai";

import axios from "axios";

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
// import { doc, setDoc } from "firebase/firestore";
// import { db } from "@/service/firebaseConfig";
import { setDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";
function CreateTrip() {
    const [place, setPlace] = useState();

    const [formData, setFormData] = useState([]);

    const [openDialog, setOpenDialog] = useState(false);

    const [loading, setLoading] = useState(false)
    
    const navigate = useNavigate();



    const handleInputChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        console.log(formData)
        console.log(login);

    }, [formData]);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
        onError: (error) => console.log(error)
    });
    



    // const OnGenerateTrip = async () => {


    //     const user = localStorage.getItem('user')

    //     if (!user) {
    //         setOpenDialog(true)
    //         return
    //     }


    //     if (!formData?.location || !formData?.budget || !formData?.people || !formData?.noOfDays) {
    //         toast("Please fill all the details.");
    //         return;
    //     }

    //     setLoading(true)

    //     const FINAL_PROMPT = AI_PROMPT
    //         .replace('{location}', formData?.location?.label)
    //         .replace('{totalDays}', formData?.noOfDays)
    //         .replace('{people}', formData?.people)
    //         .replace('{budget}', formData?.budget)
    //         .replace('{totalDays}', formData?.noOfDays)

    //         console.log(FINAL_PROMPT);

    //         const result = await chatSession.sendMessage(FINAL_PROMPT);

    //         console.log("--",result?.response?.text());
    //         SaveAiTrip(result?.response?.text())



    //     try {
    //         const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    //         const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    //         const response = await model.generateContent([FINAL_PROMPT]);
    //         console.log(response)
    //         const result = await response.response.text();
    //         console.log(result);
    //         //   const response = await result.response.text();
    //         //   console.log(response)

            
    //     } catch (err) {
    //         console.error(err);
    //         toast.error("Something went wrong while generating your trip.");
    //     }
    //     setLoading(false)
        
    // };

    const OnGenerateTrip = async () => {
        const user = localStorage.getItem('user');
    
        if (!user) {
            setOpenDialog(true);
            return;
        }
    
        if (!formData?.location || !formData?.budget || !formData?.people || !formData?.noOfDays) {
            toast("Please fill all the details.");
            return;
        }
    
        setLoading(true);
    
        const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location?.label)
            .replace('{totalDays}', formData?.noOfDays)
            .replace('{people}', formData?.people)
            .replace('{budget}', formData?.budget)
            .replace('{totalDays}', formData?.noOfDays);
    
        try {
            const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
            
            const chatSession = model.startChat();
    
            const result = await chatSession.sendMessage(FINAL_PROMPT);
    
            const tripText = await result.response.text();


    
            console.log("--", tripText);
            setLoading(false);
            SaveAiTrip(tripText);
    
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while generating your trip.");
        }
    
        
    };
    

    const SaveAiTrip = async (TripData)=>{
        setLoading(true)
        const user =JSON.parse( localStorage.getItem('user'))
        const docId = Date.now().toString()
        await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: (TripData),
        userEmail: user?.email,
        id: docId
        });
        setLoading(false);
        navigate('/view-trip/' + docId);

    }


    // }

    const GetUserProfile = (tokenInfo) => {
        axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
            headers: {
                Authorization: `Bearer ${tokenInfo?.access_token}`,
                Accept: 'Application/json'
            }
        }).then((resp) => {
            console.log(resp);
            localStorage.setItem('user', JSON.stringify(resp.data));
            setOpenDialog(false);
            toast.success("Logged in successfully!");
          }).catch((error)=>{
            console.log(error);
          });
    }


    return (
        <div className="px-4 sm:px-10 md:px-32 xl:px-56 mt-10 w-full">
            <h2 className="font-bold text-2xl sm:text-3xl text-center">Tell us your travel prefernces🌴🏕️</h2>
            <p className="mt-3 text-gray-500 text-base sm:text-lg text-center">Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

            <div className='mt-20 flex flex-col gap-9'>
                <div className="mt-12">
                    <h2 className="text-lg sm:text-xl mb-3 font-medium">What is your destination?</h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => { setPlace(v); handleInputChange('location', v) }
                        }}
                    />

                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg sm:text-xl mb-3 font-medium">How many days are you planning your trip for?</h2>
                <Input placeholder={'Ex.3'} type="number" min="0"
                    onChange={(e) => handleInputChange('noOfDays', e.target.value)}
                />
            </div>

            <div className="mt-8">
                <h2 className="text-lg sm:text-xl mb-3 font-medium">What is Your Budget?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
                    {SelectbudgetOptions.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('budget', item.title)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                        ${formData?.budget == item.title && 'shadow-lg border-black'}`}>
                            <h2 className="text-3xl sm:text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-base sm:text-lg mt-2">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-lg sm:text-xl mb-3 font-medium">Who do you plan on travelling with on your next Adventure?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-4">
                    {SelectTravelsList.map((item, index) => (
                        <div key={index}
                            onClick={() => handleInputChange('people', item.people)}
                            className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                        ${formData?.people == item.people && 'shadow-lg border-black'}`}>
                            <h2 className="text-3xl sm:text-4xl">{item.icon}</h2>
                            <h2 className="font-bold text-base sm:text-lg mt-2">{item.title}</h2>
                            <h2 className="text-sm text-gray-500">{item.desc}</h2>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <Button
                    disabled={loading}
                    onClick={OnGenerateTrip}>
                    {loading ? <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" /> : 'Generate Trip'}
                </Button>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="sr-only">Google Login</DialogTitle> {/* screen reader only */}
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
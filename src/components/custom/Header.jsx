import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout } from '@react-oauth/google';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';


function Header() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [openDialog,setOpenDialog] = useState(false);

  useEffect(()=>{
    console.log(user)
  },[])

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => GetUserProfile(tokenResponse),
    onError: (error) => console.log(error)
  });

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
        window.location.reload()
      }).catch((error)=>{
        console.log(error);
      });
}

  return (
    <div>
        
        <div className='p-3 shadow-sm flex flex-wrap justify-between items-center px-5'>
        <h2 className='text-[#ef7c6c] text-2xl md:text-4xl font-bold mb-2 md:mb-0'>TripTailor</h2> 
        <div>
        {user?
        <div className='flex gap-3 items-center'>
           <a href='/create-trip'>
          <Button variant="outline" className="rounded-full">+ Create Trip</Button>
          </a>
          <a href='/my-trips'>
          <Button variant="outline" className="rounded-full">My Trips</Button>
          </a>
          <Popover>
          <PopoverTrigger><img src={user?.picture} className='h-[35px] w-[35px] rounded-full'/></PopoverTrigger>
          <PopoverContent>
            <h2 className = "cursor-pointer" onClick={()=>{
              googleLogout();
              localStorage.clear();
              window.location.reload(true);
            }}>Logout</h2>
          </PopoverContent>
          </Popover>
        </div>
        : <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        }
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
        
    </div>
    
  )
}

export default Header
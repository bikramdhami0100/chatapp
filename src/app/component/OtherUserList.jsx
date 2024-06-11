"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'

function OtherUserList({ otheruser ,mainuserId}) {
    const [message,setmessage]=useState();
    // console.log(otheruser)
    const SendRequest=async(item)=>{
     const sendrequest=await fetch("http://localhost:4000/sendrequest",{
        method:"post",
        headers:{
            "content-type":"application/json"
        },
        body:JSON.stringify({senderId:mainuserId,receiverId:item._id,message:message})
     })
     
    const respone=await sendrequest.json();
    // console.log(respone);
     
    }
    return (
        <div>

            <Dialog >
                <DialogTrigger asChild className=' w-full outline-none'>
                    <Button variant="outline-none" >

                        <div className=' flex gap-2 justify-start'>
                            <Image className=' rounded-[20px] w-[40px] h-[40px] ' alt='other' src={otheruser.image} height={40} width={40}></Image>
                            <div>

                                <p>{otheruser.name}</p>
                                <p> {otheruser.email}</p>
                            </div>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Friend Request</DialogTitle>
                        <DialogDescription>
                            <div>
                                 
                        <div className=' flex gap-4 mt-4 justify-start items-center'>
                            <Image className=' rounded-[50px] w-[100px] h-[100px] ' alt='other' src={otheruser.image} height={40} width={40}></Image>
                            <div>

                                <p>{otheruser.name}</p>
                                <p> {otheruser.email}</p>
                                <div>
                                     <textarea className=' border-2  h-[60px] mt-3' onChange={(e)=>{
                                        setmessage(e.target.value);
                                     }}>

                                     </textarea>
                                </div>
                            </div>
                           
                        </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>

                    
                        <button  type="submit"  className=' bg-blue-600 p-2 rounded-md text-white' onClick={()=>{
                            SendRequest(otheruser)
                        }} > Send request</button>
                   
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default OtherUserList
"use client"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area';
import Cookies from 'js-cookie';
import Image from 'next/image'
import React from 'react'
import RequestMessage from './RequestMessage';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

function Profile({ user, request }) {
const router=useRouter();
  // console.log("this is request ", request)
  const newArr = []
  const array = request.filter((item, index) => {
    const id = item.from._id
    if (!newArr.includes(id)) {
      newArr.push(id);

      return true
    }
    return false

  })
  // //  console.log("this is new arr",newArr)
  // console.log("this is arr +++", array);
  const HandlerLogout = () => {
    // console.log("Logout click");
    Cookies.remove("token");
  }
  const HandlerAcceptRequest=async(item)=>{
    const requestId=item.from._id;
    const userId=user._id;
    const acceptRequest=await fetch("http://localhost:4000/acceptrequest",{
      method:"post",
      headers:{
        "content-type":"application/json"
      },
        body:JSON.stringify({userId:userId,requestId:requestId})
    })
    const respone=await acceptRequest.json();
       if (respone) {
         router.refresh();
       }
  }
  return (
    <div className=' h-full  w-[100%] lg:w-[20%] md:w-[20%]'>
      <div>
        <div>
          <Button onClick={HandlerLogout}>Logout</Button>
        </div>
        <Image className='  object-fill rounded-[50px] w-[100px] h-[100px]' src={user.image} alt='image' height={100} width={100} ></Image>
        <p>{user.name}</p>
        <p>{user.email}</p>

      </div>
      <div>
        <hr />
        <ScrollArea>
          <h1>Request from</h1>
          {
            array ? array?.map((item, index) => {

              return (
                <div>

                  {/* <div className=' flex gap-2 border p-2 cursor-pointer'>
                    <Image className=' rounded-[20px] w-[40px] h-[40px]' src={item.from.image} height={100} width={100}></Image>
                      <div>
                      <p>{item.from.name}</p>
                      <p>{item.from.email}</p>
                      </div>

                   </div> */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline-none w-full ">

                        <div className=' flex gap-2  cursor-pointer'>
                          <Image className=' mt-2 rounded-[20px] w-[40px] h-[40px]' src={item.from.image} height={100} width={100}></Image>
                          <div>
                            <p>{item.from.name}</p>
                            <p>{item.from.email}</p>
                          </div>

                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Accept Request</DialogTitle>
                        <DialogDescription>
                          Click Accept Request when you're done.
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <div className=' flex gap-2  cursor-pointer'>
                          <Image alt='image' className=' mt-2 rounded-[20px] w-[40px] h-[40px]' src={item.from.image} height={100} width={100}></Image>
                          <div>
                            <p>{item.from.name}</p>
                            <p>{item.from.email}</p>
                          </div>

                        </div>
                      </div>
                      
                        <Button onClick={()=>{
                          HandlerAcceptRequest(item)
                        }} type="submit">Accept Request</Button>
                      
                    </DialogContent>
                  </Dialog>
                </div>
              )
            }) : null
          }
        </ScrollArea>
      </div>
    </div>
  )
}

export default Profile
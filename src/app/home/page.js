"use client"
import React, { useEffect, useState } from 'react'
import Profile from '../component/Profile';
import Image from 'next/image';


import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import OtherUserList from '../component/OtherUserList';

import { jwtDecode } from "jwt-decode"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { useSocketContext } from '@/context/socketContext';

function Home() {
    const context=useSocketContext()
    console.log(context)
    const router=useRouter()
    const [myData, setMyData] = useState([]);
    const [otherUser, setOtherUser] = useState([]);
    const [request,setRequest]=useState([]);
    const [friendList,setfriendList]=useState([]);
    var [userId,setUserId]=useState();

    const mainUserIdSend = async (userId) => {
    
        
        const send = await fetch(`http://localhost:4000/mainuser/${userId}`, {
            method: "get"
        })
        const respone = await send.json();
        
        setMyData(respone);
    }

    const userIdSend = async (userId) => {
        const send = await fetch(`http://localhost:4000/users/${userId}`, {
            method: "get"
        })
        const respone = await send.json();
       
    }
    const OtherUser = async (userId) => {
        const send = await fetch(`http://localhost:4000/users/${userId}`, {
            method: "get"
        })
        const respone = await send.json();
        console.log(respone);
        setOtherUser(respone);
    }
    const HandlergetRequest = async (userId) => {
        const send = await fetch(`http://localhost:4000/getrequests/${userId}`, {
            method: "get"
        })
        const respone = await send.json();
        setRequest(respone);
        
    }
    const HandlerFriendList = async (userId) => {
        const send = await fetch(`http://localhost:4000/user/${userId}`, {
            method: "get"
        })
        const respone = await send.json();
        setfriendList(respone);
        
    }
    useEffect(() => {
        const token = Cookies.get("token");
        const jwtdecode =jwtDecode(token);
        const userId = jwtdecode.userId;
         setUserId(userId);
        console.log(userId);
        mainUserIdSend(userId);
        OtherUser(userId);
        userIdSend(userId);
        HandlergetRequest(userId)
        HandlerFriendList(userId)
    }, [])

const newArr = []
const array = friendList.filter((item, index) => {
  const id = item._id
  if (!newArr.includes(id)) {
    newArr.push(id);

    return true
  }
  return false

})


    return (
        <div className=''>
            <div>
                {
                    myData != undefined ? <Profile user={myData} request={request} /> : null
                }
                <hr />
                <div>
                    {/* accepted friends or friends list */}
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder=" search friends..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Friends List">
                                <ScrollArea>
                                   
                                {
                                    array? array.map((item,index)=>{
                                        return (
                                            <div>
                                         <CommandItem>
                                           <div onClick={()=>{
                                            router.push(`/home/${item._id}`)
                                           }} className=' flex gap-2  cursor-pointer  '>
                                             <Image src={item.image} height={100} width={100} alt='image'className=' h-[40px] w-[40px] rounded-[20px]'></Image>
                                              <div>
                                              <p>{item.name}</p>
                                              <p>{item.email}</p>
                                              </div>
                                           </div>
                                         </CommandItem>
                                    </div>
                                        )
                                    }):null
                                }
                                </ScrollArea>
                            </CommandGroup>
                            <CommandSeparator />
                         
                        </CommandList>
                    </Command>

                </div>
                <div>
                    {/* other user */}
                    <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder=" search Other..." />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Suggestions">
                                <ScrollArea>

                                    {
                                        otherUser.map((item, index) => {
                                            return (
                                                <CommandItem>
                                                    <OtherUserList mainuserId={userId} otheruser={item} />

                                                </CommandItem>
                                            )

                                        })
                                    }


                                </ScrollArea>
                            </CommandGroup>
                            <CommandSeparator />

                        </CommandList>
                    </Command>

                </div>
            </div>
            <div>
                {/* <Chatting /> */}
            </div>
        </div>
    )
}

export default Home
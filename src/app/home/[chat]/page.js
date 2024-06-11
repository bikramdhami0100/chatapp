"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSocketContext } from '@/context/socketContext';
import { LinkIcon, SendIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Chatting() {
  const context = useSocketContext();
  const [sender, setSender] = useState({});
  const [receiver, setReceiver] = useState({});
  const [mymessage, setMymessage] = useState();
  const [sendbyReceiver, setsendbyReceiver] = useState([])
  const [sendMessage, setSendMessage] = useState();
  // const [messages, setMessages] = useState([]);

  const param = useParams();
  const receiverId = param.chat;
  const userId = context.userId;
  const socket = context.socket;

  const fetchData = async () => {
    const senderResponse = await fetch(`http://localhost:4000/mainuser/${userId}`);
    const senderData = await senderResponse.json();
    setSender(senderData);

    const receiverResponse = await fetch(`http://localhost:4000/chatuser/${receiverId}`);
    const receiverData = await receiverResponse.json();
    setReceiver(receiverData);
  }


  const queryParams = new URLSearchParams({ senderId: userId, receiverId: receiverId });
  const getMessages = async () => {
    const send = await fetch(`http://localhost:4000/messages?${queryParams}`, {
      method: "get",

    })
    const respone = await send.json();
    setMymessage(respone);
    setsendbyReceiver(respone);
    console.log(respone);
  }
  //  console.log(messages)
  useEffect(() => {
    fetchData();
    getMessages();

  }, [socket, sendMessage]);
  console.log(sendMessage)
  const sendMessages = async () => {
    const send = await fetch("http://localhost:4000/sendMessage", {
      method: "Post",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ senderId: userId, receiverId: receiverId, message: sendMessage })
    })
    const respon = await send.json();
    socket.emit('sendMessage', { userId, receiverId, message: sendMessage });
    setSendMessage("");
    setTimeout(() => {
      getMessages();
    }, 100);
    console.log("data form  sendMessage ", respon)
  }

  const listeMessages = () => {

    useEffect(() => {
      socket?.on('newMessage', newMessage => {
        newMessage.shouldShake = true;
        setsendbyReceiver([...sendbyReceiver, newMessage]);
      });

      return () => socket?.off('newMessage');
    }, [socket, sendbyReceiver, setsendbyReceiver]);
  };
  console.log(sendbyReceiver);
  listeMessages();
  const formatTime = time => {
    const options = { hour: 'numeric', minute: 'numeric' };
    return new Date(time).toLocaleString('en-US', options);
  };
  return (
    <div className='text-black h-full'>
      <div className='p-1 border flex gap-2'>
        <Image className='rounded-[20px] h-[40px] w-[40px]' src={receiver.image} alt='Receiver Image' height={60} width={60} />
        <div>
          <p>{receiver.name}</p>
          <p>{receiver ? 'Online' : 'Offline'}</p>
        </div>
      </div>
      <div>
        <div className='flex flex-row justify-between p-1'>
          <div className=' p-1 text-sm rounded-md text-wrap '>
            {mymessage?.map((msg, index) => {
              return msg.senderId._id === userId && (
                <div key={index} className={'bg-blue-200 p-2 my-1    rounded-md'}>
                  <p>{msg.message}</p>
                  <p>{formatTime(msg.timeStamp)}</p>
                </div>
              )
            })}

          </div>
          <div className=' p-1 text-sm rounded-md text-wrap '>
            {sendbyReceiver.map((msg, index) => msg.senderId._id === receiverId && (
              <div key={index} className=' bg-green-200  p-2 m-2 rounded-md ' >
               <p>{msg.message}</p>
               <p>{formatTime(msg.timeStamp)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className='absolute bottom-2 justify-center items-center w-full'>
          <div className='w-full flex relative'>
            <input
              onChange={(e) => setSendMessage(e.target.value)}

              placeholder='Enter your message'
              className="h-[40px] rounded-xl w-full p-1 border-2 border-black"
              type="text"
            />
            <div onClick={sendMessages}>
              <SendIcon className='flex ml-2 mr-2 font-extrabold size-[40px] gap-2 self-center' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatting;

// "use client"
// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { useParams } from 'next/navigation';
// import { SendIcon } from 'lucide-react';
// import { useSocketContext } from '@/context/socketContext';

// function Chatting() {
//   const context = useSocketContext();
//   const [sender, setSender] = useState({});
//   const [receiver, setReceiver] = useState({});
//   const [mymessages, setMyMessages] = useState([]);
//   const [messagesFromReceiver, setMessagesFromReceiver] = useState([]);
//   const [sendMessage, setSendMessage] = useState('');
//   const [scrollPosition, setScrollPosition] = useState(0);

//   const param = useParams();
//   const receiverId = param.chat;
//   const userId = context.userId;
//   const socket = context.socket;

//   const fetchData = async () => {
//     const senderResponse = await fetch(`http://localhost:4000/mainuser/${userId}`);
//     const senderData = await senderResponse.json();
//     setSender(senderData);

//     const receiverResponse = await fetch(`http://localhost:4000/chatuser/${receiverId}`);
//     const receiverData = await receiverResponse.json();
//     setReceiver(receiverData);
//   };

//   const getMessages = async () => {
//     const queryParams = new URLSearchParams({ senderId: userId, receiverId: receiverId });
//     const response = await fetch(`http://localhost:4000/messages?${queryParams}`);
//     const data = await response.json();
//     setMyMessages(data.filter(msg => msg.senderId._id === userId));
//     setMessagesFromReceiver(data.filter(msg => msg.senderId._id === receiverId));
//   };

//   useEffect(() => {
//     fetchData();
//     getMessages();
//   }, [socket, sendMessage]);

//   const sendMessages = async () => {
//     const send = await fetch("http://localhost:4000/sendMessage", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ senderId: userId, receiverId: receiverId, message: sendMessage })
//     });
//     const respon = await send.json();
//     socket.emit('sendMessage', { userId, receiverId, message: sendMessage });
//     setSendMessage('');
//     setTimeout(() => {
//       getMessages();
//     }, 100);
//   };

//   useEffect(() => {
//     const chatContainer = document.getElementById('chat-container');
//     chatContainer.scrollTop = chatContainer.scrollHeight;
//   }, [mymessages, messagesFromReceiver]);

//   return (
//     <div className='text-black h-full'>
//       <div className='p-1 border flex gap-2'>
//         <Image className='rounded-[20px] h-[40px] w-[40px]' src={receiver.image} alt='Receiver Image' height={60} width={60} />
//         <div>
//           <p>{receiver.name}</p>
//           <p>{receiver ? 'Online' : 'Offline'}</p>
//         </div>
//       </div>
//       <div className='h-[calc(100vh - 140px)] overflow-y-auto' id='chat-container'>
//         {mymessages.map((msg, index) => (
//           <div key={index} className='text-right pr-3 py-1'>
//             <div className='inline-block bg-blue-200 py-1 px-3 rounded-md'>{msg.message}</div>
//           </div>
//         ))}
//         {messagesFromReceiver.map((msg, index) => (
//           <div key={index} className='pl-3 py-1'>
//             <div className='inline-block bg-gray-200 py-1 px-3 rounded-md'>{msg.message}</div>
//           </div>
//         ))}
//       </div>
//       <div className='absolute bottom-2 left-0 right-0'>
//         <div className='flex'>
//           <input
//             onChange={(e) => setSendMessage(e.target.value)}
//             value={sendMessage}
//             placeholder='Enter your message'
//             className='flex-1 h-[40px] rounded-xl w-full p-1 border-2 border-black'
//             type='text'
//           />
//           <button onClick={sendMessages} className='bg-blue-500 hover:bg-blue-600 rounded-full text-white w-10 h-10 flex items-center justify-center ml-2'>
//             <SendIcon size={24} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Chatting;


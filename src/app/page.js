"use client"
import { useState } from "react";
import Signup from "./component/Signup";
import { useRouter } from "next/navigation";
import LogIn from "./component/Login";

export default function Home() {
  const [show,setShow]=useState(false);
  const router=useRouter();
  return (
   <div>
      {
        show ==false ?<Signup show={show} setShow={setShow}/>:<LogIn show={show} setShow={setShow}/>
      }
   </div>
  );
}

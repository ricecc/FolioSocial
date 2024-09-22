"use client";
import MobileTopNavBarPublic from "./MobileTopNavBarPublic";
import MobileTopNavBarPrivate from "./MobileTopNavBarPrivate";
import { useAuth } from "@clerk/nextjs";


function MobileTopNavBar() {
    const { userId } = useAuth()
   
    if(userId){
        return (<MobileTopNavBarPrivate/>);
          
    }else{
        return(<MobileTopNavBarPublic/>);
    }
  
}

export default MobileTopNavBar;

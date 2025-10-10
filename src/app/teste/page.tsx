import React from "react";
import { LoginBtn } from "../components/LoginBtn";
import EventsAcive from "../components/EventCarrol";

export default function ChurchHome() {
  return (
    <div className="min-h-screen items-center flex flex-col bg-gradient-to-br from-black to-sky-700 text-white">
        <LoginBtn/>
        <EventsAcive/>
    </div>
  );
}
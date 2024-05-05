import Image from "next/image";
import AllEventsList from "../components/MainPage/AllEventsList";
import Hero from "@/components/MainPage/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { PageProps } from "@/.next/types/app/page";

export default function Home(props: PageProps) {
  return (
    <div className="flex flex-col gap-20">
      <Hero />
      <AllEventsList {...props} />
      <Footer />
    </div>
  );
}

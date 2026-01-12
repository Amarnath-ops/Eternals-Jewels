import Navbar from "@/components/Navbar";
import { SpinnerBadge } from "@/components/Spinner";
import Sidebar from "@/components/user/UserSidebar";
import { useCurrentUser } from "@/hooks/tanstack_Queries/user/profile/useCurrentUser";
import { ChevronRight } from "lucide-react";
import React from "react";
import { Link, Outlet } from "react-router-dom";

const ProfileDashboard = () => {
      const {
          data: user,
          isLoading,
          isError
      } = useCurrentUser();
  
      if (isError) {
          return <p>Failed to load user data.</p>
      }
      if (isLoading) {
          return <SpinnerBadge />
      }
    return (
        <>
            <div className="min-h-screen bg-[#D1C6BE] p-4 md:p-8 font-sans">
                <Navbar />

                {/* Main Content Layout */}
                {/* Changed flex-col to flex-row to ensure side-by-side on all screens */}
                <div className="max-w-7xl mx-auto flex flex-row gap-4 md:gap-6 mt-10 md:mt-20">
                    {/* Sidebar */}
                    <Sidebar user={user} />

                    {/* Content Area - Takes remaining width */}
                    <div className="flex-1 w-full min-w-0">
                        {" "}
                        <Outlet/>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileDashboard;

import AppSidebar from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import Topbar from "@/components/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <SidebarProvider>
        <Topbar />
        <AppSidebar />
        <main className="w-full ml-8">
          <div className="w-full min-h-[calc(100vh-80px)] py-8 px-4 pl-6 md:px-8 md:pl-10">
            <Outlet />
          </div>
          <Footer />
        </main>
      </SidebarProvider>
    </>
  );
};

export default Layout;

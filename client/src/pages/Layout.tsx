// src/pages/Layout.tsx
import { FC } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Layout: FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 font-roboto text-white flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> {/* Здесь будут подставляться все страницы */}
      </main>
      <Footer /> {/* Подвал теперь на всех страницах */}
    </div>
  );
};

export default Layout;
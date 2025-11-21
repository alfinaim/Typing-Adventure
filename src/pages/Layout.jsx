import { Outdent } from 'lucide-react';
import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
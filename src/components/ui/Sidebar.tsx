import React, { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode; defaultOpen?: boolean }> = ({ children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggle = () => setIsOpen(!isOpen);
  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
};

export const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();
  return (
    <aside 
      className={`fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-100 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex h-full flex-col py-6">
        {children}
      </div>
    </aside>
  );
};

export const SidebarHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mb-8 flex flex-col gap-2">{children}</div>
);

export const SidebarContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex-grow space-y-6 overflow-y-auto no-scrollbar">{children}</div>
);

export const SidebarFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="mt-auto border-t border-gray-100 pt-6">{children}</div>
);

export const SidebarMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="flex flex-col gap-1">{children}</nav>
);

export const SidebarMenuItem: React.FC<{ 
  children: React.ReactNode; 
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'danger';
}> = ({ children, icon, active, onClick, variant = 'default' }) => {
  const { isOpen } = useSidebar();
  
  const baseStyles = "group flex items-center px-4 py-3 text-sm font-bold transition-all w-full relative";
  const activeStyles = active 
    ? "text-[#4a9082]" 
    : "text-gray-400 hover:text-gray-900";
  const dangerStyles = "text-red-500 hover:bg-red-50";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variant === 'danger' ? dangerStyles : activeStyles} ${isOpen ? 'gap-4' : 'justify-center'}`}
      title={!isOpen && typeof children === 'string' ? children : undefined}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#4a9082] rounded-r-full" />
      )}
      <div className={`${active ? 'text-[#4a9082]' : variant === 'danger' ? 'text-red-500' : 'text-gray-400 group-hover:text-[#4a9082]'} flex-shrink-0 transition-colors`}>
        {icon}
      </div>
      {isOpen && <span className="truncate">{children}</span>}
    </button>
  );
};

export const SidebarGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

export const SidebarGroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();
  if (!isOpen) return null;
  return (
    <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
      {children}
    </h3>
  );
};

export const SidebarInset: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOpen } = useSidebar();
  return (
    <div 
      className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${
        isOpen ? 'ml-72' : 'ml-20'
      }`}
    >
      {children}
    </div>
  );
};

export const SidebarTrigger: React.FC = () => {
  const { isOpen, toggle } = useSidebar();
  return (
    <button 
      onClick={toggle}
      className="p-2 text-gray-400 hover:text-gray-900 focus:outline-none transition-all duration-300"
    >
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h2m3 0h7a2 2 0 002-2V7a2 2 0 00-2-2h-7M9 5v14m3-14v14" />
      </svg>
    </button>
  );
};

export const SidebarRail: React.FC = () => null;




interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      {/* 
          Note: Navbar is currently provided by the root layout (src/app/layout.tsx). 
          If you want it only in the (app) section, move it here and remove it from the root.
      */}
      {children}
    </>
  );
}

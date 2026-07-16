import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="h-screen flex bg-slate-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* Navbar */}
        <Navbar />
        
        <main className="flex-1 min-w-0 overflow-y-auto p-8">
          {children}
        </main>

      </div>

    </div>
  );
}

export default Layout;
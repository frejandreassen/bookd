import { Link } from "react-router-dom";
import useAuth from '@wasp/auth/useAuth';
import { Cog6ToothIcon, CalendarIcon} from '@heroicons/react/20/solid'
import "./Main.css";

export const Layout = ({ children }) => {
  const { data: user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-b from-primary-500 to-primary-600 text-white p-2 shadow-xl">
        <div className="container mx-auto px-4 py-2 flex justify-between">
          <Link to="/">
            <div className="flex space-x-2">
              <img src="/frame_lgo_pink-3.svg" className="h-8" />
              <img src="/bookd-2.png" className="h-8"/>
              {/* <h1 className="font-semibold">bookd</h1> */}
            </div>
          </Link>
          { user ? (
            <div className="flex space-x-5">
              <Link to="/home">
                <CalendarIcon className="text-white h-5 w-5" />
              </Link>
              <Link to="/settings">
                <Cog6ToothIcon className="text-white h-5 w-5" />
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <h1 className="underline">Log in</h1>
            </Link>
          )}
        </div>
      </header>

      <main className="container mx-auto flex-grow">
        {children}
      </main>
      <footer>
        <div className="container mx-auto p-4">
          <p className="text-center text-gray-500 text-sm">
            bookd ~ Powered by Wasp
          </p>
        </div>
      </footer>
    </div>
  );
};
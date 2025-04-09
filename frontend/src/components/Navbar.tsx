import { Link } from "react-router-dom";
import { useState } from "react";
import { FiSearch, FiFilter, FiShoppingCart } from "react-icons/fi";

interface NavbarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    cartCount: number;
}

const Navbar = ({ searchQuery, setSearchQuery, cartCount = 0 }: NavbarProps) => {
    const [activeTab, setActiveTab] = useState("Project");

    const tabs = [
        { name: "Project", path: "/" },
        { name: "Saved", path: "/saved" },
        { name: "Shared", path: "/shared" },
        { name: "Achievement", path: "/achievement" }
    ];

    return (
        <nav className="bg-white shadow p-4">
            <div className="container mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div className="flex space-x-6">
                    {tabs.map(tab => (
                        <Link
                            key={tab.name}
                            to={tab.path}
                            className={`font-medium ${activeTab === tab.name ? 'text-orange-500 border-b-2 border-orange-500' : 'text-gray-600 hover:text-orange-500'}`}
                            onClick={() => setActiveTab(tab.name)}
                        >
                            {tab.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search a project"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    <button className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors">
                        <FiFilter />
                    </button>
                    <div className="relative">
                        <Link to="/saved">
                            <FiShoppingCart className="text-gray-700 text-xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

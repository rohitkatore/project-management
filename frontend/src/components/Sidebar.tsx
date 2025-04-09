import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBriefcase, FiEdit, FiUser, FiChevronLeft, FiChevronRight, FiBookmark, FiShare2 } from "react-icons/fi";

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const sidebarItems = [
        { name: "Dashboard", icon: FiHome, path: "/" },
        { name: "Portfolio", icon: FiBriefcase, path: "/portfolio" },
        { name: "Saved", icon: FiBookmark, path: "/saved" },
        { name: "Shared", icon: FiShare2, path: "/shared" },
        { name: "Create", icon: FiEdit, path: "/inputs" },
        { name: "Profile", icon: FiUser, path: "/profile" }
    ];

    return (
        <div className={`fixed top-0 left-0 h-full bg-gradient-to-b from-orange-500 to-orange-600 text-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"} flex flex-col shadow-lg z-10`}>
            <div className="flex items-center justify-between p-4 border-b border-orange-400">
                {!collapsed && <h1 className="text-xl font-bold">Yoliday</h1>}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-2 rounded-full hover:bg-orange-600 focus:outline-none transition-colors"
                >
                    {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex flex-col py-4">
                    {sidebarItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center py-3 px-4 ${isActive
                                    ? "bg-orange-700 border-r-4 border-white"
                                    : "hover:bg-orange-600"
                                    }`}
                            >
                                <Icon className={`${collapsed ? "mx-auto" : "mr-4"}`} size={20} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

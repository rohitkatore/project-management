import { Link, useLocation } from "react-router-dom";
import { FiHome, FiBriefcase, FiEdit, FiUser, FiBookmark, FiShare2, FiAward } from "react-icons/fi";

const MobileSidebar = () => {
    const location = useLocation();

    const sidebarItems = [
        { name: "Dashboard", icon: FiHome, path: "/" },
        { name: "Portfolio", icon: FiBriefcase, path: "/portfolio" },
        { name: "Save", icon: FiBookmark, path: "/saved" },
        { name: "Create", icon: FiEdit, path: "/inputs" },
        { name: "Profile", icon: FiUser, path: "/profile" }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
            <div className="flex justify-around items-center py-2">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center p-2 ${isActive
                                    ? "text-orange-500"
                                    : "text-gray-500 hover:text-orange-500"
                                }`}
                        >
                            <Icon size={20} />
                            <span className="text-xs mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default MobileSidebar;

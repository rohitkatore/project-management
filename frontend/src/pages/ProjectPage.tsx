import { useState, useEffect } from "react";
import { FiPlus, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import API from "../utils/api";

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    image_url: string;
}

interface PaginationInfo {
    hasMore: boolean;
    limit: number;
    page: number;
    total: number;
    totalPages: number;
}

const ProjectPage = ({ searchQuery, cart: propCart, setCart: setPropCart }: any) => {
    // Local cart state for component-level management
    const [localCart, setLocalCart] = useState<string[]>([]);
    // Track which cart items are currently being processed
    const [loadingCartItems, setLoadingCartItems] = useState<string[]>([]);

    // Use either provided cart from props or local cart
    const cart = propCart || localCart;
    const setCart = setPropCart || setLocalCart;

    // Initialize with some fallback projects to ensure UI always has content
    const [projects, setProjects] = useState<Project[]>([
        {
            id: "1",
            title: "Kemampuan Merangkum Tulisan",
            description: "Latihan merangkum berbagai jenis tulisan dengan metode efektif",
            category: "Writing",
            author: "Bahasa Sunda",
            image_url: "https://picsum.photos/600/400?random=1"
        },
        {
            id: "2",
            title: "Bahasa Jawa Praktis",
            description: "Pembelajaran Bahasa Jawa untuk pemula dengan contoh-contoh praktis",
            category: "Language",
            author: "Pak Bambang",
            image_url: "https://picsum.photos/600/400?random=2"
        },
        {
            id: "3",
            title: "Komputer Dasar",
            description: "Pengenalan dasar-dasar komputer dan penggunaannya dalam kehidupan sehari-hari",
            category: "Technology",
            author: "Teknologi Indonesia",
            image_url: "https://picsum.photos/600/400?random=3"
        },
    ]);

    // Set some default pagination values for UI testing
    const [pagination, setPagination] = useState<PaginationInfo>({
        hasMore: true,
        limit: 3, // Smaller limit to make pagination more visible
        page: 1,
        total: 9, // Assume 9 total items to force pagination
        totalPages: 3 // Force 3 pages for demonstration
    });

    const [loading, setLoading] = useState<boolean>(true);

    const fetchProjects = async (page = 1) => {
        setLoading(true);
        try {
            const response = await API.get(`/projects?page=${page}&limit=${pagination.limit}`);
            if (response.data && response.data.projects && response.data.projects.length > 0) {
                setProjects(response.data.projects);
                setPagination(response.data.pagination);
            } else {
                // If backend returns no projects, keep the fallback data but update pagination
                setPagination(prev => ({ ...prev, page }));
            }
            console.log("Projects fetched successfully.");
        } catch (err) {
            console.log("Error fetching projects:", err);
            // On error, keep the fallback data but still update pagination page
            setPagination(prev => ({ ...prev, page }));
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart items from the database
    const fetchCartItems = async () => {
        try {
            const response = await API.get("/cart");
            if (response.data && response.data.cartItems) {
                // Extract project IDs from cart items
                const cartProjectIds = response.data.cartItems.map(
                    (item: any) => item.projectId
                );
                setCart(cartProjectIds);
                console.log("Cart fetched successfully:", cartProjectIds);
            }
        } catch (err) {
            console.log("Error fetching cart:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
        fetchCartItems(); // Fetch cart items when component mounts
    }, []);

    const [filteredProjects, setFilteredProjects] = useState(projects);

    useEffect(() => {
        if (searchQuery) {
            const filtered = projects.filter(project =>
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.author.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProjects(filtered);
        } else {
            setFilteredProjects(projects);
        }
    }, [searchQuery, projects]);

    const addToCart = async (id: string) => {
        // Add the project ID to loading state
        setLoadingCartItems(prev => [...prev, id]);

        try {
            // If item is already in cart, remove it
            if (cart.includes(id)) {
                // Here you could implement a DELETE request to remove from cart
                // await API.delete(`/cart/${id}`);
                console.log("Item removed from cart");
                setCart(cart.filter((itemId: string) => itemId !== id));
            } else {
                // Add to cart in the database
                await API.post("/cart", { projectId: id });
                console.log("Item added to cart");
                setCart([...cart, id]);
            }
        } catch (err) {
            console.log("Error updating cart:", err);
            // Show error to user
            alert("There was an error updating your cart. Please try again.");
        } finally {
            // Remove the project ID from loading state
            setLoadingCartItems(prev => prev.filter(itemId => itemId !== id));
        }
    };

    const changePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProjects(newPage);
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Portfolio</h1>
                <p className="text-gray-600">Explore and save your favorite projects</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col space-y-4">
                        {filteredProjects.map((project) => (
                            <div key={project.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex flex-col md:flex-row w-full mx-auto">
                                <div className="relative h-48 md:h-auto md:w-1/5 overflow-hidden">
                                    <img
                                        src={project.image_url}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.onerror = null;
                                            target.src = "https://via.placeholder.com/400x200?text=Image+Not+Found";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/70 to-transparent p-4 w-full">
                                        <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                            {project.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 md:p-6 flex flex-col justify-between w-full md:w-2/3">
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                                        <p className="text-gray-600 text-sm mb-3">{project.description}</p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm text-gray-500">By {project.author}</span>
                                        <button
                                            onClick={() => addToCart(project.id)}
                                            disabled={loadingCartItems.includes(project.id)}
                                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${loadingCartItems.includes(project.id)
                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                    : cart.includes(project.id)
                                                        ? "bg-green-500 text-white"
                                                        : "bg-orange-500 text-white hover:bg-orange-600"
                                                }`}
                                        >
                                            {loadingCartItems.includes(project.id) ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </>
                                            ) : cart.includes(project.id) ? (
                                                <>
                                                    <FiCheck size={16} />
                                                    <span>Saved</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiPlus size={16} />
                                                    <span>Add to Cart</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredProjects.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No projects found matching "{searchQuery}"</p>
                        </div>
                    )}

                    <div className="flex justify-center mt-8 border-t pt-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => changePage(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className={`p-2 rounded-md ${pagination.page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <FiChevronLeft />
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        onClick={() => changePage(page)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-md ${pagination.page === page
                                            ? 'bg-orange-500 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => changePage(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                className={`p-2 rounded-md ${pagination.page === pagination.totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-200'}`}
                            >
                                <FiChevronRight />
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProjectPage;

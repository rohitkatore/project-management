import { useState, useEffect } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import API from "../utils/api";

interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    author: string;
    image_url: string;
}

interface CartItem {
    id: string;
    projectId: string;
    userId: string;
    createdAt: string;
    project: Project;
}

function SavedPage() {
    const [savedItems, setSavedItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingItems, setDeletingItems] = useState<string[]>([]);

    useEffect(() => {
        const fetchSavedItems = async () => {
            try {
                const response = await API.get("/cart");
                console.log(response);
                setSavedItems(response.data.cartItems);
            } catch (error) {
                console.error("Error fetching saved items:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedItems();
    }, []);

    const removeFromCart = async (id: string) => {
        setDeletingItems(prev => [...prev, id]);

        try {
            await API.delete(`/cart/${id}`);
            setSavedItems(savedItems.filter(item => item.id !== id));
        } catch (err) {
            console.log(err);
            alert("Failed to remove item: " + (err as Error).message);
        } finally {
            setDeletingItems(prev => prev.filter(itemId => itemId !== id));
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Saved Items</h1>
                <p className="text-gray-600">Manage your saved projects</p>
            </div>

            {savedItems.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 mb-4">You haven't saved any projects yet</p>
                    <a href="/" className="text-orange-500 hover:underline">Browse projects</a>
                </div>
            ) : (
                <div className="space-y-4">
                    {savedItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow p-4 flex">
                            <img
                                src={item.project.image_url}
                                alt={item.project.title}
                                className="w-24 h-24 object-cover rounded mr-4"
                            />
                            <div className="flex-grow">
                                <div className="flex justify-between">
                                    <h3 className="font-bold">{item.project.title}</h3>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        disabled={deletingItems.includes(item.id)}
                                        className={`${deletingItems.includes(item.id)
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "text-gray-400 hover:text-red-500"
                                            }`}
                                    >
                                        {deletingItems.includes(item.id) ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <FiTrash2 size={18} />
                                        )}
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600">{item.project.description}</p>
                                <p className="text-xs text-gray-500 mt-1">By {item.project.author}</p>
                                <div className="mt-2">
                                    <span className="text-xs font-medium px-2 py-1 bg-orange-100 text-orange-800 rounded-full">
                                        {item.project.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SavedPage;

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import API from "../utils/api";

interface FormInputs {
    title: string;
    description: string;
    category: string;
    author: string;
    image_url: string;
}

const InputsPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Removed unused state variable loadingButtonId

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<FormInputs>();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        setIsSubmitting(true);
        try {
            await API.post("/project", data);
            alert("Project submitted successfully!");
            reset(); // Clear the form after successful submission
        } catch (err) {
            alert("Error in submitting form: " + err);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="px-4 py-6 md:p-6 max-w-4xl mx-auto mb-16 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">Create New Project</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Title
                    </label>
                    <input
                        type="text"
                        {...register("title", {
                            required: "Title is required",
                            minLength: { value: 5, message: "Title must be at least 5 characters long" }
                        })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter project title"
                    />
                    {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...register("description", {
                            required: "Description is required",
                            minLength: { value: 10, message: "Description must be at least 10 characters long" }
                        })}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Enter project description"
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category
                        </label>
                        <select
                            {...register("category", { required: "Category is required" })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Select a category</option>
                            <option value="Writing">Writing</option>
                            <option value="Language">Language</option>
                            <option value="Technology">Technology</option>
                            <option value="Art">Art</option>
                            <option value="Science">Science</option>
                        </select>
                        {errors.category && (
                            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Author
                        </label>
                        <input
                            type="text"
                            {...register("author", { required: "Author is required" })}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Enter author name"
                        />
                        {errors.author && (
                            <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image URL
                    </label>
                    <input
                        type="text"
                        {...register("image_url", {
                            required: "Image URL is required",
                            pattern: {
                                value: /^(http|https):\/\/[^ "]+$/,
                                message: "Enter a valid image URL"
                            }
                        })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://example.com/image.jpg"
                    />
                    {errors.image_url && (
                        <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>
                    )}
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full sm:w-auto bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Submitting...
                            </>
                        ) : (
                            "Create Project"
                        )}
                    </button>

                    {isSubmitting && (
                        <span className="mt-2 sm:mt-0 sm:ml-3 text-sm text-gray-500 text-center sm:text-left">
                            Please wait while your project is being created...
                        </span>
                    )}
                </div>
            </form>
        </div>
    );
};

export default InputsPage;

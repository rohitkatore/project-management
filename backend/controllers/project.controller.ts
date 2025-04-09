import { Request, Response } from 'express';
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

// Define interface for Project
interface Project {
    id: string;
    title: string;
    description?: string;
    category: string;
    author: string;
    image_url: string
}

// Define interface for Cart Item
interface CartItem {
    id: string;
    projectId: string;
    userId: string;
    createdAt: Date;
}

export const createProject = async (req: Request, res: Response) => {
    const { title, description, category, author, image_url } = req.body
    try {
        const project = await prisma.project.create({
            data: {
                title,
                description,
                category,
                author,
                image_url
            }
        });
        console.log(project) ;
        res.status(201).json({ message: "Project created successfully." });
    } catch (err) {
        console.log(err);
        res.status(501).json({ message: "Internal server error" })
    }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
    try {
        // Parse pagination parameters from query string
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination metadata
        const totalCount = await prisma.project.count();

        // Fetch projects with pagination
        const projects = await prisma.project.findMany({
            skip,
            take: limit,
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalCount / limit);

        res.status(200).json({
            projects,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages,
                hasMore: page < totalPages
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal sever error." });
    }
};

export const removeProject = async (req: Request, res: Response) => {
    const projectId = req.params.id; // Use route parameters instead of body

    try {
        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Optional: Check if user has permission
        // if (project.authorId !== req.user.id) {
        //   return res.status(403).json({ message: "Unauthorized" });
        // }

        await prisma.project.delete({
            where: { id: projectId }
        });

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
}


export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { projectId, userId } = req.body;

        // Validate input
        if (!projectId) {
            res.status(400).json({ message: "Project ID is required" });
            return;
        }

        // Check if project exists
        const project = await prisma.project.findUnique({
            where: { id: projectId }
        });

        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }

        // Add project to cart
        const cartItem = await prisma.cart.create({
            data: {
                projectId,
                userId: userId || 'guest', // Use 'guest' if no userId provided
            }
        });

        res.status(201).json({
            message: "Project added to cart successfully",
            cartItem
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.query.userId as string || 'guest';

        // Fetch cart items with associated project details
        const cartItems = await prisma.cart.findMany({
            where: { userId },
            include: {
                project: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.status(200).json({
            cartItems,
            count: cartItems.length
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteCart =async(req:Request,res:Response):Promise<void> =>{
    const cartId = req.params.id ;
    try{
        const project = await prisma.cart.findUnique({
            where: { id: cartId }
        });
        if(!project){
            res.status(404).json({message:"cart item not found."});
            return ;
        }
        await prisma.cart.delete({
            where: { id: cartId }
        });
        res.status(201).json({message:"Cart item remove successfully."});
    }catch(err){
        console.log(err) ;
        res.status(501).json({message:"Inernal Server error."}) ;
    }
}


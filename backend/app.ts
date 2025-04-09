import express from "express" ;
import cors from "cors" ;
import projectRoutes from "./routes/project.route"
const app = express() ;

app.use(express.json()) ;
app.use(express.urlencoded({extended:true})) ;
app.use(cors()) ;

app.use("/",projectRoutes);
app.get("/",(req,res)=>{
    res.send("Hello from server.") ;
});

export default app ;


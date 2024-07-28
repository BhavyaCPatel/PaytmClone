import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js'
import accountRoutes from './routes/account.js'


dotenv.config()
const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(express.json());

app.use('/user', userRoutes)
app.use('/accounts', accountRoutes)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
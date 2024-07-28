import Router from "express"
import dotenv from "dotenv"
import zod from "zod"
import { User, Account } from "../db/index.js"
import jwt from "jsonwebtoken"
import auth from "../middleware/authMiddleware.js"

dotenv.config()

const router = Router();
const jwtSec = process.env.JWT_SECRET


const signupSchema = zod.object({
    email: zod.string().email({ message: "Invalid email address" }),
    firstName: zod.string().min(2, { message: "First name is required" }),
    lastName: zod.string().min(2, { message: "Last name is required" }),
    password: zod.string().min(6)
})

const signinSchema = zod.object({
    email: zod.string().email(),
	password: zod.string()
})


router.post('/signup', async (req, res) => {
    try {

        const existingUser = await User.findOne({
            email: req.body.email
        })
    
        if (existingUser) {
            return res.status(411).json({
                message: "Email already taken"
            })
        }
        const { email, firstName, lastName, password } = signupSchema.parse(req.body)
        const user = new User({ email, firstName, lastName, password })
        await user.save()
        const userId = user._id;

        await Account.create({
            userId,
            balance: Math.floor(1 + Math.random() * 10000)
        })

        res.json({ message: "User created successfully" })
    } catch (error) {
        res.status(400).json({ message: error })
    }
})


router.post('/signin', async(req, res) => {
    try {

        const { email, password } = signinSchema.parse(req.body)

        if (!email || !password) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const user = await User.findOne({
            email: email,
            password: password
        });
    
        if (user) {
            const token = jwt.sign({
                userId: user._id,
                name: user.firstName
            }, jwtSec);
    
            res.json({
                message: "User signed-in successfully",
                token: token
            })
            return;
        }
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.get('/profile', auth, async(req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }
        res.json(user)
    } catch (error) {
        res.status(400).json({ message: error })
    }
})

router.put('/update', auth, async(req, res) => {
    try {
        const { email, firstName, lastName, password } = signupSchema.parse(req.body)
        const user = await User.findById(req.userId);

        if(!user) {
            return res.status(400).json({ message: "User not found" })
        }

        user.email = email || user.email;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.password = password || user.password;

        await user.save()
        res.json({message: 'User updated successfully', user})

    } catch(error) { 
        res.status(400).json({ message: error })
    }
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

export default router;
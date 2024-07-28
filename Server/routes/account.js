import Router from "express"
import dotenv from "dotenv"
import { Account } from "../db/index.js"
import auth from "../middleware/authMiddleware.js"
import mongoose from "mongoose";

dotenv.config()

const router = Router();

router.get('/balance', auth, async(req, res) => {
    try {
        if (!req.userId) {
            return res.status(400).json({ message: "UserId is undefined" });
        }
        const account = await Account.findOne({ userId: req.userId });
        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }
        res.json({ balance: account.balance });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});


router.post("/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const account = await Account.findOne({ userId: req.userId }).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    await session.commitTransaction();

    res.json({
        message: "Transfer successful"
    });
});

export default router;
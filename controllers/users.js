import bcrypt from "bcrypt";

import User from "../models/users.js";

export const signup = async (req, res) => {
    const { username, firstName, lastName, password } = req.body;
    //console.log(req.body);

    try {
        const existingUser = await User.findOne({ username });

        if(existingUser) throw new Error("User already exists")

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ username, firstName, lastName, password: hashedPassword });

        res.status(200).json({ message: "Account created successfully", result })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong", erorr: error.message })
    }
}

export const signin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });

        if(!existingUser) throw new Error("User does not exist");

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) throw new Error("Invalid credentials - username and/or password do not match");

        res.status(200).json({ message: "Logged in successfully", existingUser });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong", erorr: error.message })       
    }

}
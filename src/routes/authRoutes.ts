import {Router, Request, Response, NextFunction} from "express"
import bcrypt from 'bcrypt'
import {User, IUser} from '../schema/Schema'
import {UserSchemaType} from "../zod/zodSchema"
import {userZodValidation, usernameAvailablity} from '../middleware/middleware'
import {generateToken} from '../jwtAuth/jwt'
const authRouter = Router()

authRouter.post('/signup', userZodValidation, usernameAvailablity, async (req: Request, res: Response) => {
    console.log("signup got called")
    const {username, password} : UserSchemaType = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    try{
        await User.create({
            username: username,
            password: hashedPassword
        })
        res.status(200).send('You have succesfully signed up');
    }catch(e){
        res.status(403).send(e)
    }
})

authRouter.post('/signin', usernameAvailablity, async (req: Request, res: Response) => {
    const user_password = req.body.password;
    const user = req.user as IUser;
    const match = await bcrypt.compare(user_password, user.password);
    if(match){
        //generate token and send it to the user
        const jwt_token = generateToken({ _id: user._id.toString(), username: user.username },);
        res.json(jwt_token)
    }
    else{
        res.status(411).send("Password does not match.")
    }

})

export default authRouter;
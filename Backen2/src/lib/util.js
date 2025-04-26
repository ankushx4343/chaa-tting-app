import jwt from 'jsonwebtoken';


export const generateToken=(userId,res)=>{

    console.log(process.env.JWT_SECRET)
    const token=jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:'1d'})

    res.cookie("token",token,{
        maxAge:24*60*60*1000,
        httpOnly:true,
        secure: false,
        sameSite:"strict"
    })
    return token;
}
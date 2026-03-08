import jwt from 'jsonwebtoken';


const fetchUser = (req, res, next) => {
    try {
        const token = req.header('auth-token');
        if(!token) {
            return res.status(401).json({"error": "Invelid token"})
        }

        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).json({ "error": error });
        console.log(error)
        console.log(process.env.JWT_SECRET)
    }
}


export default fetchUser;

const validate=(schema)=>async (req,res,next)=>{
    try {
        const parseBody=await schema.parseAsync(req.body);
        req.body=parseBody;
        next();
    } catch (err) {
        const errorMessage = err.issues[0].message;
        res.status(400).json({
            message:errorMessage
        })
    }
}
module.exports=validate;
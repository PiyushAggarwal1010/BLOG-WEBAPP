
const validate=(schema)=>async (req,res,next)=>{
    try {
        const parseBody=await schema.parseAsync(req.body);
        req.body=parseBody;
        next();
    } catch (err) {
        const errorMessage = err.issues[0].message;

        const error = new Error(errorMessage);
        error.statusCode = 400;
        
        next(error);
    }
}
module.exports=validate;
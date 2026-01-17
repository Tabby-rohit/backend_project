const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next);
    }
    catch (err) {
        res.status(err.status || 500).json({
             message: err.message,
            success: false
            });
    }
}
/*
const asyncHandler = (fn) => (req, res, next) => { 
    Promise.resolve(fn(req, res, next)).catch((err)=>{next(err)});
}
*/
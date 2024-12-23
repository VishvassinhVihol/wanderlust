//in this utility folder we will store extra files like wrapAsync,error class and others
module.exports = (fn) =>{
    return (req,res,next) => {
        fn(req,res,next).catch(next)
    }
}
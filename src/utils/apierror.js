class ApiError extends Error{
    constructor (   // constructor tab run hota h jab ham naya Apierror banate hai
        statusCode,
        message= "Something went wrong",
        error= [],
        stack = ""
    ){
        super(message)   // parent class Error ka behaviour use krna h 
        // Yaha hum API ke response format define kar rahe hain.
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = error

        // Ye batata hai error kaha se aaya.
        if (stack){
            this.stack = stack //Agar stack already diya gaya hai to use use karo.
        }else{
            error.captureStackTrace(this,this.constructor)  //agar nahi diya to capture karo
        }
    }
}

export {ApiError}
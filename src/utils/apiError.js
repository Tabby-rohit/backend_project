//error is n api class  
class apierror extends Error {
  constructor(message="something went wrong", statusCode,error=[],stack="") 
  { super(message);
    this.message = message;
    this.status = statusCode;
    this.error = error;
    this.stack = stack;
    this.data = null; 
    if(stack){
      this.stack = stack;
  }
  else{
      Error.captureStackTrace(this, this.constructor);
      console.log(this.stack);
  }
}}
export {apierror}; 
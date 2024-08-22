import { userUrls} from "./endPoints";
import apiCalls from "./apiCalls";
import { FormValues } from "../utils/Validation/SignUpValidation"

export const postRegister = (userData: FormValues) => { 
  console.log(userData);
  
  return new Promise((resolve, reject) => {
    try {
      apiCalls("post", userUrls.register, userData)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    } catch (error) {
      reject({ status: 500, message: "Error" });
    }
  });
};
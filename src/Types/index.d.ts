import { UserRole } from "./role.check"

declare global {
    namespace Express{
        interface Request{
            user?:{
                id:string,
                name:string,
                email:string,
                role:string,
               emailVerification:boolean
            }
        }
    }
}
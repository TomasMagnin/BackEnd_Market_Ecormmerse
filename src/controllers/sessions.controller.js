import { UserDTO } from "../DAO/DTO/user.dto.js";

export  class  SessionsController {

    async renderSessionView(req, res) {
       try {
           return res.send(JSON.stringify(req.session));    
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           }); 
       }
    };

    async getCurrentUser(req, res) {
        try {
            const user = new UserDTO(req.session);
            return res.status(200).json({ user });
        } catch (error) {
            logger.error(error);
            return res.status(500).json({
                status: 'error',
                msg: 'something went wrong :(',
                data: {},
            });
        }  
    };

}




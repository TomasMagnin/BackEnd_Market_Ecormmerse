import { UserDTO } from "../DAO/DTO/user.dto.js";

export  class  SessionsController {

    renderSessionView(req, res) {
       try {
            return res.send(JSON.stringify(req.session.user));   
       } catch (error) {
           logger.error(error);
           return res.status(500).json({
               status: 'error',
               msg: 'something went wrong :(',
               data: {},
           }); 
       }
    };

    getCurrentUser(req, res) {
        try {
            const user = new UserDTO(req.session.user);
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

};




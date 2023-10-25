export class UserDTO {
    constructor(user){
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.age = user.age;
        this.cartID = user.cartID;
        this.role = user.role;
    };
};
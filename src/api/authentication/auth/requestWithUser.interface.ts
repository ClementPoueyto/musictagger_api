import { Request } from 'express';
import { User } from 'src/api/user/entities/user.entity';
 
interface RequestWithUser extends Request {
  user: User;
}
 
export default RequestWithUser;
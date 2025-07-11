import { User } from '../schema/Schema'; // Assuming this is your Mongoose user type

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
    userId? : Schema.Types.ObjectId
  }
}

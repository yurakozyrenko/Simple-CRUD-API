import { User } from './user-types';

export interface WorkerMessage {
    users: User[];
    data: Object;
}

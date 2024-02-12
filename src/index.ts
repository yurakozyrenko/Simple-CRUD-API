import { app } from './server';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT:number = parseInt(process.env.PORT!) || 9000

app().listen(PORT, () => {
    console.log(`Server start on port ${PORT} `);
});

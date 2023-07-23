import express, { Request, Response } from 'express';
import FindFacesInImage from './repository/network/ClarifaiApi.js';
import cors from 'cors';
import UserRepository from './repository/db/UserRepository.js';
import dotenv from 'dotenv';
import { isError } from './models/Error.js';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/image', async (req: Request, res: Response) => {
    const imageUrl = req.body.imageUrl;

    if (typeof imageUrl === 'string') {
        const response = await FindFacesInImage(imageUrl);

        const boundingBoxes = response.data.regions.map((region) => {
            const boundingBox = region.region_info.bounding_box;
            return {
                topRow: boundingBox.top_row,
                bottomRow: boundingBox.bottom_row,
                leftColumn: boundingBox.left_col,
                rightColumn: boundingBox.right_col,
            } as BoundingBox;
        });

        res.send({
            boundingBoxes,
        } as PostImageResponse);
    } else {
        res.status(400).send({
            message: "Missing required 'URL' field in body.",
        });
    }
});

app.post('/register', async (req: Request, res: Response) => {
    const login = req.body.login;
    const password = req.body.password;

    if (typeof login !== 'string') {
        res.status(400).send({
            message: 'Login is missing or is in the wrong type (should be a string).',
        });
        return;
    }

    if (typeof password !== 'string') {
        res.status(400).send({
            message: 'Password is missing or is in the wrong type (should be a string).',
        });
        return;
    }

    const userRepository = new UserRepository();

    const result = await userRepository.registerUser(login, password);

    if (isError(result)) {
        res.status(result.code).send({
            message: result.message,
        });
        return;
    }

    res.send(result);
});

app.post('/login', async (req: Request, res: Response) => {
    const login = req.body.login;
    const password = req.body.password;

    if (typeof login !== 'string') {
        res.status(400).send({
            message: 'Login is missing or is in the wrong type (should be a string).',
        });
        return;
    }

    if (typeof password !== 'string') {
        res.status(400).send({
            message: 'Password is missing or is in the wrong type (should be a string).',
        });
        return;
    }

    const userRepository = new UserRepository();

    const result = await userRepository.loginUser(login, password);

    if (isError(result)) {
        res.status(result.code).send({
            message: result.message,
        });
        return;
    }

    res.send(result);
});

app.put('/entries', async (req: Request, res: Response) => {
    const userId = req.body.userId;

    if (typeof userId !== 'number') {
        res.status(400).send({
            message: 'userId is missing or is in the wrong type (should be a number).',
        });
        return;
    }

    const userRepository = new UserRepository();

    const result = await userRepository.incrementUserEntries(userId);

    res.send({
        entries: result,
    });
});

app.listen(3001, () => {
    dotenv.config();
    console.log('Server is running on port 3001');
});

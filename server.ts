import express, { Request, Response } from 'express';
import FindFacesInImage from './repository/network/ClarifaiApi.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/image', async (req: Request, res: Response) => {
    console.log(req);
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

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

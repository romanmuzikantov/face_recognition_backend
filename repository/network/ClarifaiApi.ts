import { ClarifaiFaceDetectionResponse } from '../../models/ClarifaiFaceDetectionResponse';

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '56ee44db0b894c368a9c1b4f8a1f010d';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'v31as6ubhmp0';
const APP_ID = 'my-first-application-3qhpcm';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

export async function FindFacesInImage(imageUrl: string): Promise<ClarifaiFaceDetectionResponse> {
    const raw = JSON.stringify({
        user_app_id: {
            user_id: USER_ID,
            app_id: APP_ID,
        },
        inputs: [
            {
                data: {
                    image: {
                        url: imageUrl,
                    },
                },
            },
        ],
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Key ${PAT}`,
        },
        body: raw,
    };

    const response = await fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        requestOptions
    );
    const json = await response.json();
    const responseModel: ClarifaiFaceDetectionResponse = JSON.parse(
        JSON.stringify(json.outputs[0])
    );
    return responseModel;
}

export default FindFacesInImage;

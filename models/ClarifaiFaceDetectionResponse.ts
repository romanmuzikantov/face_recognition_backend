export interface ClarifaiFaceDetectionResponse {
    id: string;
    input: Input;
    data: ClarifaiFaceDetectionResponseData;
}

export interface ClarifaiFaceDetectionResponseData {
    regions: Region[];
}

export interface Region {
    region_info: RegionInfo;
}

export interface RegionInfo {
    bounding_box: BoundingBox;
}

export interface BoundingBox {
    top_row: number;
    left_col: number;
    bottom_row: number;
    right_col: number;
}

export interface Input {
    data: InputData;
}

export interface InputData {
    image: Image;
}

export interface Image {
    url: string;
}

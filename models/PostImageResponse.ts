interface PostImageResponse {
    boundingBoxes: BoundingBox[];
}

interface BoundingBox {
    topRow: number;
    bottomRow: number;
    leftColumn: number;
    rightColumn: number;
}

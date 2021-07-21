const FaceRecognition = ({ imageUrl, faceBox }) => {
  if (faceBox) {
    return (
      <div className="center ma">
        <p></p>
        <div className="absolute mt2">
          <img
            id="inputImage"
            src={imageUrl}
            alt="img"
            width="500px"
            height="auto"
          />
          <div
            className="bounding-box"
            style={{
              top: faceBox.topRow,
              right: faceBox.rightCol,
              bottom: faceBox.bottomRow,
              left: faceBox.leftCol,
            }}
          ></div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>Opps!! No data or The Server went down</p>
      </div>
    );
  }
};

export default FaceRecognition;

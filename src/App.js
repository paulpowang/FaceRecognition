import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import { Component } from "react";
import Clarifai from "clarifai";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const app = new Clarifai.App({
  apiKey: "e87c21ebd0b7478f9b42d82b5e934113",
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      faceBox: {},
      route: "signIn",
      isSignIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entry,
        joined: data.joined,
      },
    });
  };

  componentDidMount() {
    fetch("http://localhost:3000/")
      .then((response) => response.json())
      .then((data) => console.log(data));
  }
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
    // console.log(event.target.value);
  };

  onRouteChange = (newRoute) => {
    console.log("newRoute", newRoute);
    this.setState({ route: newRoute });
    console.log("route", this.state.route);
    if (newRoute === "home") {
      this.setState({ isSignIn: true });
    } else {
      this.setState({ isSignIn: false });
    }
  };

  calculateFaceBox = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(clarifaiFace);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ faceBox: box });
    // console.log(this.faceBox);
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });

    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // THE JPG
        this.state.imageUrl
      )
      .then((response) => {
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            })
              .then((response) => response.json())
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              }),
          });
        }
        this.displayFaceBox(this.calculateFaceBox(response));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    console.log(this.state.route);
    return (
      <div className="App">
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignIn={this.state.isSignIn}
        />

        {this.state.route === "home" ? (
          <div>
            <Logo />

            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              imageUrl={this.state.imageUrl}
              faceBox={this.faceBox}
            />
          </div>
        ) : this.state.route === "signIn" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;

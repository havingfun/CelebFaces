import React from 'react';
import axios from 'axios';

class Upload extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      file: null
    }
  }
  
  handleChange = (event) => {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      uploaded: event.target.files[0]
    }, () => {
      this.getFaces(this.state.file);
      const bounding_box = {
        "left": 35.54827065765858,
        "top": 34.57884384691715,
        "right": 160.25924891233444,
        "bottom": 189.14457780122757
      }
      const { left, top, right, bottom } = bounding_box;
      this.drawCroppedImage(left, top, right - left, bottom - top, 100, 100);
    })
  }

  getFaces = (image) => {
    console.log("Getting Faces");
    let data = new FormData();
    data.append('image', image)
    axios.post('http://167.172.72.129:5000/face-recognition?include_predictions=false', data, {
      headers: {
          'Content-Type': 'multipart/form-data',
      }
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  drawCroppedImage = (x, y, width, height, canvas_width, canvas_height) => {
    const canvas = this.refs["canvas"];
    const img = this.refs.image
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    const ctx = canvas.getContext('2d');
  
    img.onload = () => {
      ctx.drawImage(
        img,
        x,
        y,
        width,
        height,
        0,
        0,
        canvas_width,
        canvas_height,
      );
    }
  }

  render = () => {
    return (
      <div>
        <input type="file" onChange={this.handleChange}/>
        <br/><br/>
        {   this.state.file && (
            <React.Fragment>
              <img alt="uploaded" ref="image" width="400px" src={this.state.file}/>
              <br/><br/>
            </React.Fragment>
          )
        }
        {
          this.state.file && (
            <canvas ref="canvas" />
          )
        }
      </div>
    );
  }
}
export default Upload
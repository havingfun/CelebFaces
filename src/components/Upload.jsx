import React from 'react';
import axios from 'axios';
const FACE_API = "http://167.172.72.129:5000/face-recognition?include_predictions=false"
class FaceDetector extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      file: null,
      blob: null,
      faces_data: null
    }
  }
  
  handleChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
    if (!file || !validImageTypes.includes(file['type'])) {
      alert('Upload Valid Image');
    } else {
      this.setState({
        file: URL.createObjectURL(file),
        uploaded: file
      }, () => {
        this.getFaces(this.state.uploaded);
      })
    }
  }

  getFaces = (image) => {
    let data = new FormData();
    data.append('image', image)
    axios.post(FACE_API, data, {
      headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
      }
    })
    .then((response) => {
      this.setState(prevState => {
        return {
          ...prevState,
          faces_data: response.data
        }
      }, () => {
        const faces = this.state.faces_data['faces'];
        if (faces) {
          for (const id in faces) {
            const { left, top, right, bottom } = faces[id]["bounding_box"];
            this.drawCroppedImage(left, top, right - left, bottom - top, 100, 100, "face_canvas_" + id);
          }
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  drawCroppedImage = (x, y, width, height, canvas_width, canvas_height, canvas_ref) => {
    const canvas = this.refs[canvas_ref];
    const img = this.refs.image
    canvas.width = canvas_width;
    canvas.height = canvas_height;
    const ctx = canvas.getContext('2d');
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
          this.state.faces_data && 
            Object.entries(this.state.faces_data.faces).map(([face, value]) => (
              <React.Fragment>
                <canvas ref={"face_canvas_" + face}
                  key={"face_canvas_" + face}
                />
                <h3 key={"face_label_" + face}>{value.top_prediction.label}</h3>
              </React.Fragment>
            ))
        }

      </div>
    );
  }
}
export default FaceDetector
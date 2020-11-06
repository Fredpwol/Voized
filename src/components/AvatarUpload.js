import React from "react";
import { Upload, message, Button } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import ImageCrop from "antd-img-crop";

import { uploadImage } from '../actions'

class AvatarUpload extends React.Component {

    constructor(props){
        super(props);
        this.props = props;
    }
  state = {
    loading: false,
    form: null,
    file:null,
  };

  
beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error("Image must smaller than 5MB!");
    return false;
  }
  this.setState({...this.state, file: file})
  return isJpgOrPng && isLt2M;
}

  uploadImage = () => {
    this.setState({ ...this.state,loading: true });
    // Get this url from response in real world.
    const form = new FormData();
    form.append("file", this.state.file);
      
    console.log(form);
    this.props.uploadImage(form, this.props.user.id, this.props.user.token, (data) =>{
      this.setState({...this.state, loading: false})
      if (data.status === "error"){
        message.error(data.message)
      }
    });
    
  };

  render() {
    const { loading} = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <div>
        <ImageCrop rotate >
      <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={(file) => this.beforeUpload(file)}
        style={this.props.style}
      >
        {this.props.user.profileImage ? (
          <img src={this.props.user.profileImage} alt="avatar" style={{ width: "100%" }} />
        ) : (
          uploadButton
        )}
      </Upload>
      </ImageCrop>
     <div style={{marginLeft:"15px"}}>
     <p>{this.state.file ? this.state.file.name : null}</p>
      <Button type="primary" onClick={this.uploadImage} loading={loading}>
        Upload
      </Button>
     </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth,
});
export default connect(mapStateToProps, { uploadImage })(AvatarUpload);

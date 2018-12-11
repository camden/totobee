import React from 'react';
import PropTypes from 'prop-types';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imagePreviewDataURL: null,
      file: null,
    };
  }

  handleImageChange = e => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.props.onImageChange(reader.result);
      this.setState({
        imagePreviewDataURL: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  renderImagePreview = () => {
    const { imagePreviewDataURL } = this.state;
    if (imagePreviewDataURL) {
      return <img src={imagePreviewDataURL} />;
    } else {
      return null;
    }
  };

  render() {
    return (
      <div>
        <input type="file" onChange={this.handleImageChange} />
        {this.renderImagePreview()}
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onImageChange: PropTypes.func.isRequired,
};

export default ImageUpload;

import React from 'react';
import PropTypes from 'prop-types';

import styles from './ImageUpload.scss';

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
      return <img src={imagePreviewDataURL} className={styles.imagePreview} />;
    } else {
      return null;
    }
  };

  render() {
    let uploadPicPrompt = 'Upload a picture';
    let uploadButtonClassNames = styles.chooseFileButton;

    if (this.state.imagePreviewDataURL) {
      uploadPicPrompt = 'Looks good! ✓';
      uploadButtonClassNames += ' ' + styles.chooseFileButtonDone;
    }

    return (
      <div>
        <label className={uploadButtonClassNames} htmlFor="imageInput">
          {uploadPicPrompt}
        </label>
        <input
          className={styles.inputfile}
          type="file"
          accept="image/*"
          id="imageInput"
          onChange={this.handleImageChange}
        />
        {this.renderImagePreview()}
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onImageChange: PropTypes.func.isRequired,
};

export default ImageUpload;

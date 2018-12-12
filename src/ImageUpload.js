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

    if (this.state.imagePreviewDataURL) {
      uploadPicPrompt = 'Done ✓';
    }

    return (
      <div>
        <button className={styles.chooseFileButton}>
          <label className={styles.labelText} htmlFor="imageInput">
            {uploadPicPrompt}
          </label>
        </button>
        <input
          className={styles.inputfile}
          type="file"
          accept="image/*"
          id="imageInput"
          name="imageInput"
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

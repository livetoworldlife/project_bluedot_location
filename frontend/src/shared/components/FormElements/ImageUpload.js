//161 -Building image upload component
import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  const [file, setFile] = useState();// 162-using ImageUpload component in a form
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  useEffect(() => {
    if (!file) { return; }
    const fileReader = new FileReader();                      //baked into the browser and offer it into browser side Js the file reader https://developer.mozilla.org/en-US/docs/Web/API/FileReader
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file])
  //                                                          to generate st helps us preview image-upload__preview
  //                                                          and forward the file to surrounding component
  const pickedHandler = event => {
    //                                                      162-using ImageUpload component in a form
    let pickedFile;                                   //if we didn't pick up a valid file it become undefined
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;                               // isValid not become true immediately so we did it manually 
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);

  };

  return (
    <div className="form-control">

      <input id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onClick={pickedHandler} />

      <div className={`image-upload ${props.center && 'center'}`}>
        <div className="image-upload__preview">
          {previewUrl && <img scr={previewUrl} alt="Preview" />}                              {/*162-using ImageUpload component in a form */}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div >
  )
}
export default ImageUpload;
import React, { Component } from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// import Heading from '@ckeditor/ckeditor5-heading/src/heading';

class FileUpload extends Component {
    constructor(props) {
        super(props);
        this.state = { selectedFile: null, loaded: 0 }
    }

    handleselectedFile = event => {
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0
        })
    }

    handleUpload = () => {
        const data = new FormData()
        data.append('file', this.state.selectedFile, this.state.selectedFile.name)
        data.append("rewriteName", this.state.selectedFile.name);
        data.append("pathFolderSave", '/images/UserFeedback/');
        axios
            .post("http://sandbox.resources.anbinhairlines.vn/Image/UploadImage/", data, {
                headers: {
                    "Authorization": "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDgyNDAxMDUsImlzcyI6IkFCQWlyU2VydmljZSIsImF1ZCI6IkFCQWlyU2VydmljZSJ9.jgIb_eiDDh6YpTFAXbtJeu-Y4FGsXGxJ_YSLUJfIZno'
                },
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total * 100),
                    })
                },
            })
            .then(res => {
                console.log(res)
            })
    }

    render() {
        return (
            <div className="App">
                <input type="file" name="" id="" onChange={this.handleselectedFile} />
                <button onClick={this.handleUpload}>Upload</button>
                <div> {Math.round(this.state.loaded, 2)} %</div>
            </div>
        )
    }
}

class MyUploadAdapter {
    constructor(loader, url) {
        this.loader = loader;
        this.url = url;
    }

    upload() {
        return new Promise((resolve, reject) => {
            this._initRequest();
            this._initListeners(resolve, reject);
            this._sendRequest();
        });
    }

    abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
    }

    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();
        xhr.open('POST', this.url, true);
        // xhr.responseType = 'json';
        xhr.setRequestHeader("Authorization", "Bearer " + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NDgyNDAxMDUsImlzcyI6IkFCQWlyU2VydmljZSIsImF1ZCI6IkFCQWlyU2VydmljZSJ9.jgIb_eiDDh6YpTFAXbtJeu-Y4FGsXGxJ_YSLUJfIZno');
    }

    _initListeners(resolve, reject) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = 'Couldn\'t upload file:' + ` ${loader.file.name}.`;
        console.log('xhr: ', xhr);
        xhr.addEventListener('error', () => reject(genericErrorText));
        xhr.addEventListener('abort', () => reject());
        xhr.addEventListener('load', () => {
            const response = xhr.response;
            console.log('response: ' + JSON.stringify(response));
            if (!response || response.error) {
                return reject(response && response.error ? response.error.message : genericErrorText);
            }
            resolve({
                default: response.fileLocation
            });
        });
        if (xhr.upload) {
            xhr.upload.addEventListener('progress', evt => {
                if (evt.lengthComputable) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            });
        }
    }

    _sendRequest() {
        const data = new FormData();
        console.log('send file: ' + this.loader.file);
        data.append('file', this.loader.file);
        data.append("rewriteName", this.loader.file.name);
        data.append("pathFolderSave", '/images/UserFeedback/');
        this.xhr.send(data);
    }
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <h2>Using CKEditor 5 build in React</h2>
                <CKEditor
                    editor={ClassicEditor}

                    data="<p>Hello from CKEditor 5!</p>"
                    onInit={editor => {
                        // editor.config.get('toolbar').items = ["heading", "|",];
                        // You can store the "editor" and use when it is needed.
                        editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
                            return new MyUploadAdapter(loader, 'http://sandbox.resources.anbinhairlines.vn/Image/UploadImage/');
                        };
                        console.log('Editor is ready to use!', Array.from(editor.ui.componentFactory.names()));
                    }}
                    config={{
                        toolbar: [
                            "heading", "|", "bold", "italic", "link", "bulletedList",
                            "numberedList", "imageUpload", "blockQuote", "insertTable",
                            "mediaEmbed", "undo", "redo"
                        ]
                    }}
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log({ event, editor, data });
                    }}
                    onBlur={editor => {
                        console.log('Blur.', editor);
                    }}
                    onFocus={editor => {
                        console.log('Focus.', editor);
                    }}
                />
            </div>
        );
    }
}

export default App;
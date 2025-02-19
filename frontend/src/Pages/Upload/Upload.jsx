import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, X, FileText, AlertCircle } from 'lucide-react';
import config from '../../config';


function Upload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = [...e.dataTransfer.files];
    validateAndSetFiles(droppedFiles);
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFiles = [...e.target.files];
    validateAndSetFiles(selectedFiles);
  };

  // Validate files
  const validateAndSetFiles = (fileList) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const maxFiles = 5;

    // Clear previous messages
    setMessage({ type: '', text: '' });

    // Check number of files
    if (fileList.length > maxFiles) {
      setMessage({ type: 'error', text: `Maximum ${maxFiles} files allowed at once` });
      return;
    }

    const validFiles = fileList.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        setMessage({ type: 'error', text: 'Only PNG, JPEG, and PDF files are allowed' });
        return false;
      }
      if (file.size > maxSize) {
        setMessage({ type: 'error', text: 'Files must be less than 10MB' });
        return false;
      }
      return true;
    });

    setFiles(prevFiles => {
      const newFiles = [...prevFiles, ...validFiles];
      if (newFiles.length > maxFiles) {
        setMessage({ type: 'error', text: `Maximum ${maxFiles} files allowed` });
        return prevFiles;
      }
      return newFiles;
    });
  };

  // Remove file from selection
  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setMessage({ type: '', text: '' });
  };

  // Handle file upload
  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage({ type: 'error', text: 'Please select files to upload' });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${config.BASE_URL}/api/purchase-orders/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Files uploaded successfully!' });
        setFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error uploading files. Please try again.'
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mt-4 mb-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Upload Purchase Orders</h2>
              
              {/* Drag & Drop Zone */}
              <div
                className={`border-2 border-dashed rounded-3 p-4 text-center ${
                  uploading ? 'opacity-50' : 'cursor-pointer'
                }`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{ borderStyle: 'dashed', borderWidth: '2px' }}
              >
                <UploadIcon className="mx-auto mb-3" size={48} />
                <p className="mb-2">Drag and drop files here or click to select</p>
                <p className="text-muted small mb-0">
                  Supported formats: PNG, JPEG, PDF (Max 10MB per file)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".png,.jpg,.jpeg,.pdf"
                  multiple
                  className="d-none"
                  disabled={uploading}
                />
              </div>

              {/* File List */}
              {files.length > 0 && (
                <div className="mt-4">
                  <h6 className="mb-3">Selected Files:</h6>
                  <div className="list-group">
                    {files.map((file, index) => (
                      <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <FileText size={20} className="me-2" />
                          <div>
                            <div className="text-truncate" style={{ maxWidth: '300px' }}>
                              {file.name}
                            </div>
                            <small className="text-muted">
                              {formatFileSize(file.size)}
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeFile(index)}
                          disabled={uploading}
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Bar */}
              {uploading && (
                <div className="mt-4">
                  <div className="progress">
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{ width: `${uploadProgress}%` }}
                      aria-valuenow={uploadProgress}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >{uploadProgress}%</div>
                  </div>
                </div>
              )}

              {/* Message */}
              {message.text && (
                <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} mt-4 d-flex align-items-center`}>
                  {message.type === 'error' ? (
                    <AlertCircle size={20} className="me-2" />
                  ) : (
                    <FileText size={20} className="me-2" />
                  )}
                  {message.text}
                </div>
              )}

              {/* Upload Button */}
              <button
                className="btn btn-primary w-100 mt-4"
                onClick={handleUpload}
                disabled={uploading || files.length === 0}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Upload;
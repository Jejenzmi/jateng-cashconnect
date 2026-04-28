import React, { useState } from 'react';

interface DicomFile {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  filePath: string;
  studyId: string;
  seriesId: string;
  instanceId: string;
  patientId: string;
  visitId: string;
  createdAt: Date;
}

const PacsModule: React.FC = () => {
  const [files, setFiles] = useState<DicomFile[]>([]);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [selectedFile, setSelectedFile] = useState<DicomFile | null>(null);
  const [patientId, setPatientId] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadStatus('uploading');

    // Simulasi upload file
    setTimeout(() => {
      const newFile: DicomFile = {
        id: `dicom-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        filePath: `/storage/dicom/${patientId}/${file.name}`,
        studyId: `STUDY_${Date.now()}`,
        seriesId: `SERIES_${Date.now()}`,
        instanceId: `INSTANCE_${Date.now()}`,
        patientId,
        visitId: 'visit-1',
        createdAt: new Date()
      };

      setFiles(prev => [...prev, newFile]);
      setUploadStatus('success');
      
      // Reset setelah 2 detik
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 1500);
  };

  const handleViewImage = (file: DicomFile) => {
    setSelectedFile(file);
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Modul PACS (Picture Archiving and Communication System)</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Manajemen arsip dan komunikasi gambar medis
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="patient-id" className="block text-sm font-medium text-gray-700">
                ID Pasien
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  id="patient-id"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Masukkan ID Pasien"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="dicom-upload" className="block text-sm font-medium text-gray-700">
                Upload File DICOM
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="dicom-file" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                      <span>Upload file</span>
                      <input 
                        id="dicom-file" 
                        name="dicom-file" 
                        type="file" 
                        className="sr-only" 
                        accept=".dcm"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="pl-1">atau drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    File DICOM (MAX. 100MB)
                  </p>
                </div>
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="mt-3 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400 animate-spin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Upload sedang berlangsung...</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {uploadStatus === 'success' && (
                <div className="mt-3 rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">Upload Berhasil</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>File DICOM berhasil diupload ke server.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {files.length > 0 && (
            <div className="mt-8">
              <h4 className="text-md font-medium text-gray-900 mb-4">File DICOM Tersimpan</h4>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <li key={file.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-indigo-600 truncate">{file.fileName}</div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {file.mimeType}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6 flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 2h6v4H7V6zm6 6H7v2h6v-2z" clipRule="evenodd" />
                              </svg>
                              {Math.round(file.fileSize / 1024 / 1024)} MB
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {file.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                          <div className="mt-2 flex space-x-4 sm:mt-0">
                            <button
                              onClick={() => handleViewImage(file)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Tampilkan
                            </button>
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {selectedFile && (
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Tampilan Gambar DICOM</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Menampilkan file: {selectedFile.fileName}
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6 flex justify-center">
                <div className="border border-gray-300 rounded-md p-4 bg-gray-100 w-full max-w-3xl h-96 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Tampilan Gambar DICOM</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Dalam implementasi nyata, ini akan menampilkan gambar medis dari file DICOM.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Tutup Tampilan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PacsModule;
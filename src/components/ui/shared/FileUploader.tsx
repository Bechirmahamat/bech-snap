import React, { useCallback, useState } from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { Button } from '../button'
type FileUpLoaderProps = {
    fieldChange: (FILES: File[]) => void
    mediaUrl: string
}
const FileUploader = ({ fieldChange, mediaUrl }: FileUpLoaderProps) => {
    const [fileUrl, setFileUrl] = useState('')
    const [file, setFile] = useState<File[]>([])
    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            setFile(acceptedFiles)
            fieldChange(acceptedFiles)
            setFileUrl(URL.createObjectURL(acceptedFiles[0]))
        },
        [file]
    )
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.svg'],
        },
    })
    return (
        <div
            {...getRootProps()}
            className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'
        >
            <input {...getInputProps()} className='cursor-pointer ' />
            {fileUrl ? (
                <div>test 1</div>
            ) : (
                <div className='file_updloader-box'>
                    <img
                        src='assets/icons/file-upload.svg'
                        width={96}
                        height={77}
                        alt='file-upload'
                    />
                    <h3 className='base-medium text-light-2 mb-2 mt-6'>
                        Drag photo here
                    </h3>
                    <p className='text-light-4 small-regular mb-6'>
                        SVG, PNG, JPG
                    </p>
                    <Button className='shad-button_dark_4 mb-6'>
                        Select from computer
                    </Button>
                </div>
            )}
        </div>
    )
}
export default FileUploader

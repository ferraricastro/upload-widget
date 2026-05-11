import axios from 'axios'

interface UploadFilesToStorageParams {
    file: File
}

export async function uploadFileToStorage ({ file }: UploadFilesToStorageParams) {
    const data = new FormData ()

    data.append('file', file)

    const response = await axios.post<{ url: string }>('http://localhost:3333/uploads', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })

    return { url: response.data.url }
}
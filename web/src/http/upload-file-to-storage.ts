import axios from 'axios'

interface UploadFilesToStorageParams {
    file: File
    onProgress: (sizeInBytes: number) => void
}

interface UploadFileToStorageOpts {
    signal?: AbortSignal
}

export async function uploadFileToStorage (
    { file, onProgress }: UploadFilesToStorageParams,
    opts?: UploadFileToStorageOpts
) {
    const data = new FormData ()

    data.append('file', file)

    const response = await axios.post<{ url: string }>('http://localhost:3333/uploads', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        signal: opts?.signal,
        onUploadProgress(progressEvent) {
            onProgress(progressEvent.loaded)
        },
    })

    return { url: response.data.url }
}
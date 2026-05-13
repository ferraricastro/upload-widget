interface CompressImageParams {
    file: File
    maxWidth?: number
    maxHeight?: number
    quality?: number
}

function convertToWebp(filename: string): string {
    if (!filename.includes('.')) {
        return `${filename}.webp`
    }

    return filename.replace(/\.[^/.]+$/, '.webp')
}

export function compressImage({
    file,
    maxWidth = Number.POSITIVE_INFINITY,
    maxHeight = Number.POSITIVE_INFINITY,
    quality = 1,
}: CompressImageParams) {
    const allowedFileTypes = [
        'image/jpg',
        'image/jpeg',
        'image/png',
        'image/webp',
    ];

    if (!allowedFileTypes.includes(file.type)) {
        throw new Error('Image format not supported.')
    }

   return new Promise<File>((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = event => {
            const compressed = new Image()

            compressed.onload = () => {
                const canvas = document.createElement('canvas')

                let width = compressed.width
                let height = compressed.height

                if (width > height) {
                    if(width > maxWidth) {
                        width = maxWidth
                        height *= maxWidth / width
                    }
                } else {
                    if(height > maxHeight) {
                        height = maxHeight
                        width *= maxHeight / height
                    }
                }

                canvas.width = width
                canvas.height = height

                const context = canvas.getContext('2d')

                if (!context) {
                    reject(new Error('Fail to get canvas context.'))
                    return
                }

                context.drawImage(compressed, 0, 0, width, height)

                canvas.toBlob(
                    blob => {
                        if (!blob) {
                            reject(new Error('Fail to convert image.'))
                            return 
                        }

                        const compressedFile = new File(
                            [blob], 
                            convertToWebp(file.name),
                            {
                                type: 'image/webp',
                                lastModified: Date.now(),
                            }
                        )

                        resolve(compressedFile)
                    },
                    'image/webp',
                    quality,
                )
            }

            compressed.src = event.target?.result as string
        }

        reader.readAsDataURL(file)
   })
}
import fs from 'fs/promises'
import path from 'path'

export const deleteImage = async (fileName: string): Promise<void> => {
  try {
    let filePath: string
    if (fileName.includes('uploads')) {
      filePath = path.join(__dirname, '../../', fileName)
    } else {
      filePath = path.join(__dirname, '../../', 'uploads', fileName)
    }

    await fs.access(filePath)
    await fs.unlink(filePath)
    console.log('File deleted successfully:', fileName)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.error('File does not exist:', fileName)
    } else {
      console.error('Error deleting file:', err)
    }
  }
}

import { diskStorage } from 'multer'
import { extname } from 'path'

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname))
  }
})

export default storage

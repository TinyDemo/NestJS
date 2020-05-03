import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export default (): MulterOptions => ({
  fileFilter: (req, file, callback) => {
    const allowType = ['image/png', 'image/jpeg'];
    if (allowType.indexOf(file.mimetype) < 0) {
      callback(new BadRequestException('错误的类型'), false);
    }
    callback(null, true);
  },
});

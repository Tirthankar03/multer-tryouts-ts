import express, { Request, Response } from 'express'
import multer from 'multer'
import cors from 'cors'
import dotenv from "dotenv";


dotenv.config();

interface MulterRequest extends Request {
    files?: {
      [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
  }

let app = express()

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'], // Update with your frontend's origin
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type',
  }));

app.use(express.json())
app.use(express.urlencoded({extended: false}))


const fileFilter = (req: MulterRequest, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.fieldname === 'resume') {
      if (
        file.mimetype === 'application/pdf' ||
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
      }
    } else {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
      } else {
        cb(null, false);
      }
    }
  };



  //multer config
const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
})


//the function will return true if files is an object where each key is a string and each value is an array of Express.Multer.File.
const isMulterFileArrayDictionary = (files: MulterRequest['files']) : files is {[fieldname: string]: Express.Multer.File[] } => {
    return files !== undefined && !Array.isArray(files);
  };




  app.post('/form-upload',upload.fields([{name: 'file', maxCount: 1}, {name: 'profileImg', maxCount: 1}, {name: 'resume', maxCount: 1}]), async (req: MulterRequest, res: Response) =>{
    try {
        console.log('req body in form upload>>>>>>', req.body);


        
        const bodyMain = req.body.bodyMain ? JSON.parse(req.body.bodyMain) : {};
        console.log('Parsed bodyMain:', bodyMain);

        

        console.log('req files in form upload>>>>>>', req.files);


        // console.log('req 1 >>>>>>>>>>>', req.files['resume']);
        


        if (isMulterFileArrayDictionary(req.files)) {
      const profileImg = req.files['profileImg'] ? req.files['profileImg'][0] : null;
      const file = req.files['file'] 
      const resume = req.files['resume'] 
      if (profileImg) {
        console.log('seperate Profile Image>>>>>>>>>>>>>>>>>>>>>>>>>>>:', profileImg);
      } else {
        console.log('No profile image uploaded');
      }

      if (file) {
        console.log(' seperate File>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:', file);
      } else {
        console.log('No file uploaded');
      }


      if (resume) {
        console.log('seperate resume >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:', resume);
      } else {
        console.log('No resume uploaded');
      }
    } else {
      console.log('No files uploaded');
    }

    res.status(200).send('Files uploaded successfully');
    } catch (err) {
        console.log('error in form upload>>>>>>', err);
        
    }
})


const PORT = 4000
app.listen(PORT, () =>  {
    console.log(`App is listening at port ${PORT} `);
    
})


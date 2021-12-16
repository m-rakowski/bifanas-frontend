import formidable from "formidable";
import fs from "fs";
import {NextApiRequest, NextApiResponse} from 'next'
import {v2} from "cloudinary";
import {withApiAuthRequired} from "@auth0/nextjs-auth0";

export const config = {
    api: {
        bodyParser: false
    }
};

const saveFileInProject = async (file) => {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync('freshly_updated', data);
    await fs.unlinkSync(file.filepath);
    console.log('saveFileInProject, saved', file.originalFilename);
};

const uploadToCloudinary = async (file) => {
    const res = await v2.uploader.upload("freshly_updated");
    console.log('uploadToCloudinary, uploaded', res.secure_url);
    return res.secure_url;
};

function formidablePromise(req, opts): Promise<{ fields: any, files: any }> {
    return new Promise(function (resolve, reject) {
        const form = new formidable.IncomingForm(opts)
        form.parse(req, function (err, fields, files) {
            if (err) return reject(err)
            resolve({fields: fields, files: files})
        })
    })
}

export default withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse) => {

        try {
            const {files} = await formidablePromise(req, {});

            await saveFileInProject(files.file);
            const secure_url = await uploadToCloudinary(files.file);
            res.status(201).send({secure_url});
        } catch (error) {
            res.status(400).json(error);
        }
    }
)

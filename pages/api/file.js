import formidable from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false
    }
};

const post = async (req, res) => {
    const form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, files) {
        await saveFile(files.file);
        return res.status(201).send("");
    });
};

const saveFile = async (file) => {
    const projectPath = __dirname.replace('\\.next\\server\\pages\\api', '');

    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(projectPath + `/public/freshly_uploaded`, data);
    await fs.unlinkSync(file.filepath);
    return;
};

export default async function handler(req, res) {
    try {
        return post(req, res)
    } catch (err) {
        res.status(404).send("")
    }
};

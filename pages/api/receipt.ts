import {createWorker} from 'tesseract.js';
import {NextApiRequest, NextApiResponse} from "next";

const worker = createWorker({
    logger: m => console.log(m)
});

const mockText = 'L1ISBOA ]\n' +
    'Ident. TPA O1I2?274011\n' +
    '2021-12-05 L5:52:34\n' +
    'Per:074 1r:005: Ma3/5\n' +
    'VISA INTERNAC IONAL\n' +
    'TCARTAO: FREID206\n' +
    'TC: SDICOGFAAAEEESOB 5\n' +
    'AOOONNONO31010\n' +
    'VISA\n' +
    'COMPRA 3,95€ |\n' +
    'COMPRA 1,95€ |\n' +
    'ID.Estab. 006312 2092\n' +
    'AUT:WR2OPB VI DB EEA\n' +
    'REDUNIO\n' +
    'XJ,.V\'.N”l IH\'IVWÓVÉ)\n' +
    'Autenticação realizada\n' +
    'peh)(f?ª*ô,yx;í)í_i:,llx;na lli:t.\')vtªí j\n';

function extractTotal(s) {
    let regex = /[0-9],[0-9][0-9]€/g;
    const found = s.match(regex);
    if (found && found.length) {
        return found[0];
    } else {
        return 'NOT FOUND'
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await worker.load();
        await worker.loadLanguage('por');
        await worker.initialize('por');
        const {data: {text}} = await worker.recognize('http://localhost:3000/freshly_uploaded');
        res.status(200).json({
            total: extractTotal(text),
            text: text
        });
        await worker.terminate();
    } catch (err) {
        res.status(500).send(err)
    }
}

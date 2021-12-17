import {createWorker} from 'tesseract.js';
import {NextApiRequest, NextApiResponse} from "next";
import {withApiAuthRequired} from '@auth0/nextjs-auth0';
import initMiddleware from '../../lib/init-middleware'
import validateMiddleware from '../../lib/validate-middleware'
import {check, validationResult} from 'express-validator'

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

const validateBody = initMiddleware(
    validateMiddleware([
        check('secure_url').isLength({min: 1, max: 300}),
    ], validationResult)
)
export default withApiAuthRequired(
    async (req: NextApiRequest, res: NextApiResponse) => {
        try {

            await validateBody(req, res)
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(422).json({errors: errors.array()})
            }

            await worker.load();
            await worker.loadLanguage('por');
            await worker.initialize('por');

            const body = JSON.parse(req.body)

            if (!body || !body.secure_url) {
                res.status(500).json({error: "No secure_url provided"});
            }

            const {data: {text}} = await worker.recognize(body.secure_url);
            res.status(200).json({
                total: extractTotal(text),
                text: text
            });
            await worker.terminate();
        } catch (error) {
            res.status(500).send({error});
        }
    }
)

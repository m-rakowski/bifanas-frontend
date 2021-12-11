import {NextApiRequest, NextApiResponse} from 'next'

import fs from 'fs'
import path from 'path'

const filePath = path.resolve('.', 'freshly_updated')
const imageBuffer = fs.readFileSync(filePath)

export default (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader('Content-Type', 'image/jpg')
    res.send(imageBuffer)
}

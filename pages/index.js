import useSwr from 'swr'
import Image from 'next/image'
import receipt from '../public/262837841_894706987859516_8067427122901118575_n.jpg'


const fetcher = (url) => fetch(url).then((res) => res.json())

export default function Index() {
    const {data, error} = useSwr('/api/receipt', fetcher)

    return (
        <>
            <h2>{data?.total ?? "Loading..."}</h2>

            <div style={{display: 'flex'}}>
                <Image
                    src={receipt}
                    alt="Picture of the author"
                    height={600}
                />
                <div style={{whiteSpace: 'pre-wrap'}}>{data?.text ?? "Loading..."}</div>
            </div>
        </>
    )
}

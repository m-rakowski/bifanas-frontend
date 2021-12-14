import {useState} from "react";
import {useUser} from '@auth0/nextjs-auth0';
import Image from 'next/image';
import Link from 'next/link';


export default function Index() {
    const [image, setImage] = useState(null);
    const [data, setData] = useState(null);
    const [secureUrl, setSecureUrl] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);
    const {user, error, isLoading} = useUser();

    const uploadToClient = (event) => {
        if (event.target.files && event.target.files[0]) {
            const i = event.target.files[0];

            setImage(i);
            setCreateObjectURL(URL.createObjectURL(i));
        }
    };

    const uploadToServer = async (event) => {
        const body = new FormData();
        body.append("file", image);
        const response = await fetch("/api/file", {
            method: "POST",
            body
        });
        const {secure_url} = await response.json();

        setSecureUrl(secure_url);
    };

    const getOCR = async () => {
        await getParsedData(secureUrl);
    };

    const getParsedData = async (secure_url: string) => {
        const res = await fetch("/api/receipt", {
            body: JSON.stringify({secure_url}),
            method: "POST"
        });
        const data = await res.json();
        setData(data);
    };

    return (
        <>
            <nav>
                {user
                    ? <div>Welcome {user.name}! <Link href="/api/auth/logout"><a>Logout</a></Link></div>
                    : <Link href="/api/auth/login"><a>Login</a></Link>
                }
            </nav>
            {user && <div>

                <h2>{data?.total}</h2>

                <div>
                    <input type="file" name="myImage" onChange={uploadToClient}/>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={uploadToServer}
                    >
                        Send to server
                    </button>
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={getOCR}
                    >
                        Get OCR
                    </button>
                </div>

                {createObjectURL && <Image src={createObjectURL}
                                           alt={'uploaded image'}
                                           width={500}
                                           height={600}
                />}
                <div style={{whiteSpace: 'pre-wrap'}}>{data?.text}</div>
            </div>}
        </>
    )
}

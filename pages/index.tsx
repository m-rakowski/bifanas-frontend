import {useState} from "react";


export default function Index() {
    const [image, setImage] = useState(null);
    const [data, setData] = useState(null);
    const [createObjectURL, setCreateObjectURL] = useState(null);

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

        const res = await fetch("/api/receipt");
        const data = await res.json();
        setData(data);
    };

    return (
        <>
            <h2>{data?.total}</h2>

            <div>
                <input type="file" name="myImage" onChange={uploadToClient}/>
                <button
                    className="btn btn-primary"
                    type="submit"
                    onClick={uploadToServer}
                >
                    Send to server
                </button>
            </div>

            <div style={{display: 'flex'}}>
                <img src={createObjectURL}
                     height={600}
                />
                <div style={{whiteSpace: 'pre-wrap'}}>{data?.text}</div>
            </div>
        </>
    )
}

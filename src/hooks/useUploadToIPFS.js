const uploadToIPFS = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
        try {
            const result = await client.add(file); // IPFS client
            console.log(result);
            setImage(`https://ipfs.infura.io/ipfs/${result.path}`); //setting the Image to the link where we can img file on IPFS
        } catch (error) {
            console.log("ipfs image upload error: ", error);
        }
    }
}
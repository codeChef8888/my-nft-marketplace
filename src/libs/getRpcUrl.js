export const nodes = [process.env.REACT_APP_RPC_URL];
export const node = process.env.REACT_APP_RPC_URL;

const getRpcUrl = () => {
    console.log(node, "yo ho RPC URL...")
    return process.env.REACT_APP_RPC_URL;
};

export default getRpcUrl;

import { Circle } from "better-react-spinkit";

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        height: "100vh",
    }
}

const Loading = () => {
    return (
        <div style={styles.container}>
            <Circle color="#00acc1" size={100} />
        </div>
    )
}

export default Loading

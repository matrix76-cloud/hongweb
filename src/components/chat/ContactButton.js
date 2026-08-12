const ContactButton = ({ click }) => (
    <motion.button
        initial={{ scale: 1, opacity: 1 }}
        animate={{ scale: [1, 1.05, 1], opacity: [1, 0.7, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={styles.button}
        onClick={click}
    >
        계약서 서명하기
    </motion.button>
);



const styles = {
    button: {
        backgroundColor: "#FF7A00",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        padding: "8px 0px",
        width: "35%",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginLeft: "5px",
    },
};

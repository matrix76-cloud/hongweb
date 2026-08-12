const ShareCTA = () => {
    return (
        <div style={{
            marginTop: 40,
            padding: 20,
            textAlign: 'center',
            backgroundColor: '#fff'
        }}>
            <div style={{
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 10
            }}>
                앱에서는 더 많은 기능이 기다리고 있어요!
            </div>
            <a
                href="https://honglady.co.kr/app-download"
                style={{
                    backgroundColor: '#FF6A00',
                    padding: '10px 20px',
                    borderRadius: 8,
                    color: '#fff',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    display: 'inline-block',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
            >
                구해줘 알바 설치하러 가기
            </a>
        </div>
    );
};

export default ShareCTA;

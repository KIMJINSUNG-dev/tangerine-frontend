function DocumentFieldView({ fields }) {

    if(!fields || Object.keys(fields).length === 0) {

        return <p>필드 정보가 없어요.</p>;
    }

    return (

        <table style={{ width: "100%", borderCollapse: "collapse"}}>
            <tbody>
                {Object.entries(fields).map(([key, value]) => (
                    <tr key={key} style={{ borderBottom: "1px solid #eee" }}>
                        <td style={{
                            padding: "8px 16px 8px 0",
                            fontWeight: "500",
                            width: "30%",
                            color: "#555"
                        }}>
                            {key}
                        </td>
                        <td style={{ padding: "8px 0 "}}>{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default DocumentFieldView;
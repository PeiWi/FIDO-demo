function Table(props) {
    return (
        <div className="keyList">
            <h2 className="keyListTitle">token keyList</h2>
            <table>
                <thead>
                    <tr>
                        <th scope="col">keyid</th>
                        <th scope="col">fidoProtocol</th>
                        <th scope="col" width="20%">
                            credentialId
                        </th>
                        <th scope="col">createLocation</th>
                        <th scope="col">createDate</th>
                        <th scope="col">lastusedLocation</th>
                    </tr>
                </thead>
                <tbody>{renderTable(props.tableItem)}</tbody>
            </table>
        </div>
    );
}

function renderTable(props) {
    return props.map((item, i) => (
        <tr key={i}>
            <td key={item.keyid}>{item.keyid}</td>
            <td key={item.fidoProtocol}>{item.fidoProtocol}</td>
            <td key={item.credentialId}>{item.credentialId}</td>
            <td key={item.createLocation}>{item.createLocation}</td>
            <td key={item.createDate}>{new Date(Number(item.createDate)).toLocaleString('zh')}</td>
            <td key={item.lastusedLocation}>{item.lastusedLocation}</td>
        </tr>
    ));
}

export default Table;

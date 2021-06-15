import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';

const url = 'https://node-bar-billiards.herokuapp.com';

function TablesMenu() {

    const [tablesData, setTablesData] = useState([]);

    useEffect(() => {
        console.log('loaded.')
        const fetchData = async () => {
            const result = await axios(
              url + '/api/tables',
            );
            setTablesData(result.data);
        };
        fetchData();
    }, []);
    
    

    return (
        <div className='container'>
            {tablesData.map(table => (
                <Table 
                    name={table.name} 
                    key={table.tableId}
                    tableId={table.tableId}
                    imgName={table.imgName}
                />
            ))}
        </div>
        
    )
}

export default TablesMenu;
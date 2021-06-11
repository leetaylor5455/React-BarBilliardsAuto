import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';

function TablesMenu() {

    const [tablesData, setTablesData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
              'http://localhost:8080/api/tables',
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
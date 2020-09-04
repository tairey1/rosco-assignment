import React, { useState, useEffect } from 'react';
import './Table.scss';
import data from '../data.json';
import datalimit from '../datalimit.json';
import Row from '../row/Row';

function Table(props) {

    const [tableRows, setTableRows] = useState([]),
        [totalDataUsage, setTotalDataUsage] = useState('0');

    useEffect(() => {
        // I imported the json file above, but here's what the fetch call would look like
        // fetch('data.json')
        //     .then(res => res.json())
        //     .then(res => {
        //         below code would go here
        //     })

        // for the data limit
        // fetch('datalimit.json')
        //     .then(res => res.json())
        //     .then(res => {
        //         below code would go here
        //     })

        //sort the response
        var sortedData = data.response.sort(function(a,b) {
            const x = a.device.groups[0] ? a.device.groups[0].toLowerCase() : -10;
            const y = b.device.groups[0] ? b.device.groups[0].toLowerCase() : -10;
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });

        //supply the table with data
        let sumDataUsage = 0,
            index=0,
            citiesArr = [],
            tempTableRows = [];
        sortedData.forEach(element => {
            let cityName = element.device.groups[0];
            if (cityName && !citiesArr.includes(cityName)) {
                citiesArr.push(cityName);
                let deviceArr = data.response.filter(device => {
                    return device.device.groups[0] === cityName;
                });
                tempTableRows.push(
                    <Row key={index} index={index} data={deviceArr} name={cityName} datalimit={datalimit.response}/>
                );
                index++;
            }
            sumDataUsage += (element.device.usage.down_usage + element.device.usage.up_usage);
        });

        //get devices without a group
        let withoutGroup = data.response.filter(device => {
            return device.device.groups[0] === undefined;
        });
        tempTableRows.push(
            <Row key={index} index={index} data={withoutGroup} datalimit={datalimit.response} name={'Without Group (total)'}
        />);

        //get total data usage, convert to correct units
        if (sumDataUsage < 1) {
            setTotalDataUsage(<strong>{(sumDataUsage * 1024).toFixed(2) + ' KB'}</strong>);
        }
        else if (sumDataUsage >= 1024) {
            setTotalDataUsage(<strong>{(sumDataUsage/1024).toFixed(2) + ' GB'}</strong>);
        }
        else {
            setTotalDataUsage(<strong>{sumDataUsage.toFixed(2) + ' MB'}</strong>)
        }
        setTableRows(tempTableRows);
    }, [])

    return (
        <table className='traffic-table'>
            <thead className='table-head'>
                <tr className='traffic-table-header'>
                    <td className='empty'/>
                    <td className='name-cell'>Group Name</td>
                    <td className='start-cell'>Start Date</td>
                    <td className='end-cell'>End Date</td>
                    <td className='traffic-cell'>Traffic Up / Down</td>
                </tr>
            </thead>
            {tableRows}
            <tfoot className='table-foot'>
                <tr className='total-row'>
                    <td className='empty'/>
                    <td className='name-cell'>Totals:</td>
                    <td className='start-cell'>8/01/20</td>
                    <td className='end-cell'>8/31/20</td>
                    <td className='traffic-cell'>Total Traffic: {totalDataUsage}</td>
                </tr>
            </tfoot>
        </table>
    );
}

export default Table;
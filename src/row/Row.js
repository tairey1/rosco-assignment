import React, { useState, useEffect } from 'react';
import './Row.scss';

function Row(props) {

    const [dataTable, setDataTable] = useState([]),
        [totalDataUsage, setTotalDataUsage] = useState(0),
        [dataUnits, setDataUnits] = useState('MB'),
        [showRowDanger, setShowRowDanger] = useState(false),
        [headerCellClass, setHeaderCellClass] = useState('traffic-cell'),
        [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (props.data.length) {
            //default is MB
            let multiplier = 1;

            //if data is all less than 1MB, change to KB
            if (!(props.data.find(element => (element.device.usage.down_usage + element.device.usage.up_usage) >= 1))) {
                setDataUnits('KB');
                multiplier = 1024;
            }
            //if data is all more than 1024MB, change to GB
            else if (!(props.data.find(element => (element.device.usage.down_usage + element.device.usage.up_usage) <= 1024))) {
                setDataUnits('GB');
                multiplier = 1/1024;
            }

            //temporary array to store table data
            let tempDataArray = [],
                index = 0,
                sumGroupDataUsage = 0;
            props.data.forEach(device => {
                let vehicle_name = device.device.vehicle_name,
                    totalUsage = (device.device.usage.up_usage + device.device.usage.down_usage),
                    cellClass = '';

                //if usage has gone over the limit
                if (totalUsage > props.datalimit) {
                    setShowRowDanger(true);
                    //colors the header cell red
                    setHeaderCellClass(style => style + ' danger');
                    //colors the individual cell red
                    cellClass = 'danger';
                }
                //if usage is approaching the limit
                else if (totalUsage > props.datalimit - 10) {
                    //if the header cell is red, don't change it
                    !showRowDanger && setHeaderCellClass(style => style + ' warning');
                    //colors the individual cell yellow
                    cellClass = 'warning';
                }
                tempDataArray.push(<tr key={index} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td className='empty'/>
                    <td colSpan='3' className='name-cell'>{vehicle_name}</td>
                    <td className={cellClass + ' traffic-cell'}>
                        {(totalUsage * multiplier).toFixed(2)}
                    </td>
                </tr>);
                sumGroupDataUsage += totalUsage;
                index++;
            });

            //format total data usage
            if (sumGroupDataUsage < 1) {
                setTotalDataUsage((sumGroupDataUsage * 1024).toFixed(2) + ' KB');
            }
            else if (sumGroupDataUsage >= 1024) {
                setTotalDataUsage((sumGroupDataUsage/1024).toFixed(2) + ' GB');
            }
            else {
                setTotalDataUsage(sumGroupDataUsage.toFixed(2) + ' MB')
            }

            //populate table
            setDataTable(tempDataArray);
        }
    }, [props]);

    return (<>
        <thead className='data-row'>
            <tr className={props.index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td className='usage-header empty'>
                    <button className='open-table' onClick={() => {isOpen ? setIsOpen(false) : setIsOpen(true)}}>
                        {isOpen ? '-' : '+'}
                    </button>
                </td>
                <td className='vehicle-header'>{props.name}</td>
                <td>8/01/20</td>
                <td>8/31/20</td>
                <td className={headerCellClass}>
                    {totalDataUsage}
                </td>
            </tr>
        </thead>
        {isOpen &&
            <tbody className='traffic-body'>
                <tr className='row-subheader'>
                    <td className='empty'/>
                    <td colSpan='3' className='vehicle-row name-cell'>Name / ID</td>
                    <td className='usage-row traffic-cell'>Traffic Up / Down ({dataUnits})</td>
                </tr>
                {dataTable}
            </tbody>
        }
    </>);
}

export default Row;
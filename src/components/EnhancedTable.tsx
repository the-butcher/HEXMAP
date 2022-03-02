import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import React, { useEffect, useRef, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { IChartData } from '../data/IChartData';
import { IChartEntry } from '../data/IChartEntry';
import { FormattingDefinition } from '../util/FormattingDefinition';
import { TimeUtil } from '../util/TimeUtil';
import { IChartProps } from './IChartProps';

// interface Data {
//     calories: number;
//     carbs: number;
//     fat: number;
//     name: string;
//     protein: number;
// }

// function createData(
//     name: string,
//     calories: number,
//     fat: number,
//     carbs: number,
//     protein: number,
// ): Data {
//     return {
//         name,
//         calories,
//         fat,
//         carbs,
//         protein,
//     };
// }

// const rows = [
//     createData('Cupcake', 305, 3.7, 67, 4.3),
//     createData('Donut', 452, 25.0, 51, 4.9),
//     createData('Eclair', 262, 16.0, 24, 6.0),
//     createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//     createData('Gingerbread', 356, 16.0, 49, 3.9),
//     createData('Honeycomb', 408, 3.2, 87, 6.5),
//     createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//     createData('Jelly Bean', 375, 0.0, 94, 0.0),
//     createData('KitKat', 518, 26.0, 65, 7.0),
//     createData('Lollipop', 392, 0.2, 98, 0.0),
//     createData('Marshmallow', 318, 0, 81, 2.0),
//     createData('Nougat', 360, 19.0, 9, 37.0),
//     createData('Oreo', 437, 18.0, 63, 4.0),
// ];

const chartData: IChartData = {

    valueCount: 2,
    entries: [
        {
            instant: TimeUtil.parseCategoryDateFull('01.03.2022'),
            value_0: 1000,
            label_0: FormattingDefinition.FORMATTER__FLOAT_2.format(1000),
            value_1: 23.444444,
            label_1: FormattingDefinition.FORMATTER__FLOAT_2.format(23.444444)
        }
    ],
    minX: TimeUtil.parseCategoryDateFull('01.03.2022'),
    maxX: TimeUtil.parseCategoryDateFull('01.03.2022'),
    minY: 20,
    maxY: 1000
}


function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
    order: Order,
    orderBy: Key,
): (
        a: { [key in Key]: number | string },
        b: { [key in Key]: number | string },
    ) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

interface IHeadCell {
    disablePadding: boolean;
    id: string;
    label: string;
    numeric: boolean;
}

// const headCells: readonly HeadCell[] = [
//     {
//         id: 'name',
//         numeric: false,
//         disablePadding: true,
//         label: 'Dessert (100g serving)',
//     },
//     {
//         id: 'calories',
//         numeric: true,
//         disablePadding: false,
//         label: 'Calories',
//     },
//     {
//         id: 'fat',
//         numeric: true,
//         disablePadding: false,
//         label: 'Fat (g)',
//     },
//     {
//         id: 'carbs',
//         numeric: true,
//         disablePadding: false,
//         label: 'Carbs (g)',
//     },
//     {
//         id: 'protein',
//         numeric: true,
//         disablePadding: false,
//         label: 'Protein (g)',
//     },
// ];

interface ITableHeadProps {
    onRequestSort: (event: React.MouseEvent<unknown>, key: string) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
    headCells: IHeadCell[];
}

function EnhancedTableHead(props: ITableHeadProps) {

    const { order, orderBy, rowCount, headCells, onRequestSort } = props;
    const createSortHandler = (key: string) => (event: React.MouseEvent<unknown>) => {
        onRequestSort(event, key);
    };

    return (
        <TableHead>
            <TableRow>

                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default (props: IChartProps) => {

    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<string>();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    let { source, breadcrumbProps } = props;

    useEffect(() => {

        console.debug('⚙ updating table component (breadcrumbProps)', props);
        const tsA = Date.now();

        const dataSetting = DataRepository.getInstance().getDataSetting(source);

        // props.breadcrumbProps.forEach(p => {

        //     // breadcrumbs defi

        //     // last breadcrumb defines columns

        //     console.log('breadcrump (table)', p.name);

        // });
        const keyCount = dataSetting.getDataset().getKeysetKeys().length;

        const _headCells: IHeadCell[] = [];
        let dataKeys: string[][] = [[]];
        for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {

            const keyLabel = dataSetting.getDataset().getKeysetKeys()[keyIndex];
            // console.log('keyLabel (table)', keyLabel, dataSetting.getDataset().getKeyset(keyLabel));

            const keyset = dataSetting.getDataset().getKeyset(keyLabel);
            const _dataKeys: string[][] = [];
            keyset.getRaws().forEach(k => {
                dataKeys.forEach(d => {
                    _dataKeys.push([...d, k]);
                });
            });
            dataKeys = [..._dataKeys];

            _headCells.push({
                disablePadding: false,
                id: keyLabel,
                label: keyLabel,
                numeric: false
            });

        }
        console.log('dataKeys', dataKeys);

        const rawCount = dataSetting.getDataset().getIndexKeyset().getRawCount();
        for (let rawIndex = 0; rawIndex < rawCount; rawIndex++) {
            const indexLabel = dataSetting.getDataset().getIndexKeyset().getValue(rawIndex);
            const isKey = dataSetting.getDataset().getIndexKeyset().hasKey(rawIndex);
            if (isKey) {
                _headCells.push({
                    disablePadding: true,
                    id: indexLabel,
                    label: indexLabel,
                    numeric: true
                });
            }
        }

        const dataEntry = dataSetting.getDataset().getEntryByDate('25.02.2022');
        console.log('dataEntry', dataEntry);
        dataKeys.forEach(k => {

            // console.log(k.join());
            for (let keyIndex = 0; keyIndex < k.length; keyIndex++) {

                // const value = dataSetting.getDataset().getIndexKeyset().getValue(k[keyIndex]);
                const keysetName = dataSetting.getDataset().getIndexKeyset().getValue(k[keyIndex]);
                // const keyLabel = dataSetting.getDataset().getKeyset(keyIndex).getValue[keyIndex];
                console.log('keysetName', keysetName);

            }

            // const dataKey = dataEntry.getValue(k.join());
        })

        setTableHeadProps({
            ...tableHeadProps,
            headCells: _headCells
        })

        // const chartData = DataRepository.getInstance().getChartData(source, Number.MIN_VALUE, Number.MAX_VALUE);
        // const data = dataSetting.getDataset();
        // console.log('data (table)', data);

    }, [breadcrumbProps]);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: string,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const [tableHeadProps, setTableHeadProps] = React.useState<ITableHeadProps>({
        order: 'asc',
        orderBy: '',
        rowCount: 5,
        onRequestSort: handleRequestSort,
        headCells: []
    });

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {


    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (

        <div style={{ width: '100%' }}>

            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                >
                    <EnhancedTableHead {...tableHeadProps} />
                    <TableBody>

                        {/* if you don't need to support IE11, you can replace the `stableSort` call with: rows.slice().sort(getComparator(order, orderBy))
                        {rows.slice().sort(getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {

                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.name.toString())}
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.name}
                                    >
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.calories}</TableCell>
                                        <TableCell align="right">{row.fat}</TableCell>
                                        <TableCell align="right">{row.carbs}</TableCell>
                                        <TableCell align="right">{row.protein}</TableCell>
                                    </TableRow>
                                );
                            })}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows, }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )} */}

                    </TableBody>
                </Table>
            </TableContainer>
            {/* <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> */}
        </div>


    );
}
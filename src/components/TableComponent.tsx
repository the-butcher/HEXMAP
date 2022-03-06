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
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { DataRepository } from '../data/DataRepository';
import { ObjectUtil } from '../util/ObjectUtil';
import { TimeUtil } from '../util/TimeUtil';
import { IChartProps } from './IChartProps';

function descendingComparator(rowA: ITableRow, rowB: ITableRow, sortk: string) {
    if (sortk) {
        const sortvA = rowA.cells.find(c => c.sortk === sortk).sortv;
        const sortvB = rowB.cells.find(c => c.sortk === sortk).sortv;
        if (sortvA < sortvB) {
            return -1;
        }
        if (sortvA > sortvB) {
            return 1;
        }
    }
    return 0;
}

type Order = 'asc' | 'desc';

function createComparator(order: Order, sortk: string): (rowA: ITableRow, rowB: ITableRow) => number {
    return order === 'desc' ? (rowA, rowB) => descendingComparator(rowA, rowB, sortk) : (rowA, rowB) => -descendingComparator(rowA, rowB, sortk);
}

interface IHeadCell {
    id: string;
    label: string;
    numeric: boolean;
    width: string
}

interface ITableRow {
    id: string,
    cells: IBodyCell[]
}

interface IBodyCell {
    id: string,
    label: string,
    sortk: string,
    sortv: string | number,
    numeric: boolean,
}

interface ITableHeadProps {
    onRequestSort: (event: MouseEvent<unknown>, key: string) => void;
    order: Order;
    sortk: string;
    rowCount: number;
    headCells: IHeadCell[];
}

export default (props: IChartProps) => {

    const [order, setOrder] = useState<Order>('asc');
    const [sortk, setSortk] = useState<string>();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    let { source, breadcrumbProps, instant } = props;

    useEffect(() => {

        console.debug('⚙ updating table component (breadcrumbProps)', props);

        const dataSetting = DataRepository.getInstance().getDataSetting(source);
        const keyCount = dataSetting.getDataset().getKeysetKeys().length;
        const rawCount = dataSetting.getDataset().getIndexKeyset().getRawCount();

        const keyCellWeight = 1.3;
        const colWeightRatio = 100 / (keyCount * keyCellWeight + rawCount + 1);

        const _headCells: IHeadCell[] = [{
            id: 'date',
            label: 'Datum',
            numeric: false,
            width: `${colWeightRatio}%`
        }];
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
                id: keyLabel,
                label: keyLabel,
                numeric: false,
                width: `${colWeightRatio * keyCellWeight}%`
            });

        }
        // console.log('dataKeys', dataKeys);

        for (let rawIndex = 0; rawIndex < rawCount; rawIndex++) {
            const indexLabel = dataSetting.getDataset().getIndexKeyset().getValue(rawIndex);
            const isKey = dataSetting.getDataset().getIndexKeyset().hasKey(rawIndex);
            if (isKey) {
                _headCells.push({
                    id: indexLabel,
                    label: indexLabel,
                    numeric: true,
                    width: `${colWeightRatio}%`
                });
            }
        }

        const validatedInstant = dataSetting.getDataset().getValidInstant(instant);
        const date = TimeUtil.formatCategoryDateFull(validatedInstant);
        const dataEntry = dataSetting.getDataset().getEntryByDate(date);
        // console.log('dataEntry', dataEntry);

        // const fieldValues: string[] = [];
        const _tableRows: ITableRow[] = [];
        dataKeys.forEach(k => {

            const rowKey = k.join('');

            const rowDate = TimeUtil.formatCategoryDateFull(dataEntry.getInstant());
            const _tableRow: ITableRow = {
                id: rowKey,
                cells: [{
                    id: ObjectUtil.createId(),
                    sortk: 'date',
                    sortv: rowDate,
                    label: rowDate,
                    numeric: false
                }]
            }

            // console.log(k.join());
            for (let keyIndex = 0; keyIndex < k.length; keyIndex++) {

                const keyLabel = dataSetting.getDataset().getKeysetKeys()[keyIndex];

                // const value = dataSetting.getDataset().getIndexKeyset().getValue(k[keyIndex]);
                const keysetValue = dataSetting.getDataset().getKeyset(keyLabel).getValue(k[keyIndex]);
                // const keyLabel = dataSetting.getDataset().getKeyset(keyIndex).getValue[keyIndex];
                // fieldValues.push(keysetValue);

                _tableRow.cells.push({
                    id: ObjectUtil.createId(),
                    sortk: keyLabel,
                    sortv: keysetValue,
                    label: keysetValue,
                    numeric: false
                });

            }

            const rawCount = dataSetting.getDataset().getIndexKeyset().getRawCount();
            for (let rawIndex = 0; rawIndex < rawCount; rawIndex++) {
                const isKey = dataSetting.getDataset().getIndexKeyset().hasKey(rawIndex);
                if (isKey) {
                    const keysetValue = dataEntry.getValue(rowKey, rawIndex);
                    // fieldValues.push(keysetValue.label());
                    _tableRow.cells.push({
                        id: ObjectUtil.createId(),
                        sortk: dataSetting.getDataset().getIndexKeyset().getValue(rawIndex),
                        sortv: keysetValue.noscl,
                        label: keysetValue.label(),
                        numeric: true
                    });
                }
            }

            _tableRows.push(_tableRow);

            // const dataKey = dataEntry.getValue(k.join());
        })
        // console.log('_tableRows', _tableRows);

        setTableHeadProps({
            ...tableHeadProps,
            headCells: _headCells
        });
        setRows(_tableRows);

        // const chartData = DataRepository.getInstance().getChartData(source, Number.MIN_VALUE, Number.MAX_VALUE);
        // const data = dataSetting.getDataset();
        // console.log('data (table)', data);

    }, [instant]);

    const createSortHandler = (key: string) => (event: MouseEvent<unknown>) => {
        handleRequestSort(event, key);
    };

    const handleRequestSort = (event: MouseEvent<unknown>, sortk1: string) => {
        const isAsc = sortk1 === sortk && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setSortk(sortk1);
        // console.log(sortk, order);
    };

    const [tableHeadProps, setTableHeadProps] = useState<ITableHeadProps>({
        order: 'asc',
        sortk: '',
        rowCount: 5,
        onRequestSort: handleRequestSort,
        headCells: []
    });
    const [rows, setRows] = useState<ITableRow[]>([]);

    const handleClick = (event: MouseEvent<unknown>, name: string) => {

    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    return (

        <div style={{ width: '100%' }}>

            <TableContainer>
                <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    size={'small'}
                >
                    <TableHead>
                        <TableRow>

                            {tableHeadProps.headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    align={headCell.numeric ? 'right' : 'left'}
                                    padding={'normal'}
                                    sortDirection={sortk === headCell.id ? order : false}
                                    width={headCell.width}
                                >
                                    <TableSortLabel
                                        active={sortk === headCell.id}
                                        direction={sortk === headCell.id ? order : 'asc'}
                                        onClick={createSortHandler(headCell.id)}
                                    >
                                        {headCell.label}
                                        {sortk === headCell.id ? (
                                            <Box component="span" sx={visuallyHidden}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {rows.slice().sort(createComparator(order, sortk)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            return (
                                <TableRow
                                    hover
                                    onClick={(event) => handleClick(event, row.id)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.id}
                                >
                                    {row.cells.map(c => {
                                        return <TableCell key={c.id} align={c.numeric ? 'right' : 'left'}>{c.label}</TableCell>
                                    })}
                                </TableRow>
                            );
                        })}

                        {emptyRows > 0 && (
                            <TableRow style={{ height: 33 * emptyRows, }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div >

    );
}
"use client";

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import dayjs from 'dayjs';
import CssBaseline from '@mui/material/CssBaseline';

import purpleTheme from '../../theme/PurpleTheme';
import { generateDates } from '../../utils/CalculatorUtils';

export default function Calculator() {
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());
    const [calendarType, setCalendarType] = useState('');
    const [errorCalendarType, setErrorCalendarType] = useState(false);

    const [reqDays, setReqDays] = useState(0);
    const [errorReqDays, setErrorReqDays] = useState(false);

    const [rangeResults, setRangeResults] = useState([]);

    const handleCalculate = () => {
        let isError = false;

        if (errorReqDays || !reqDays) {
            isError = true;
        }

        if (!calendarType) {
            setErrorCalendarType(true);
            isError = true;
        }

        if (isError) return;
        const ranges = generateDates(calendarType, startDate, endDate, reqDays);
        setRangeResults(ranges);
    }

    const handleClearResults = () => {
        setRangeResults([]);
    }

    // const handleDownload = () => {
    //     const header = "date";
    //     const content = rangeResults.map(date => dayjs(date).format('MM-DD-YYYY')).join('\n');
    //     const csvContent = `${header}\n${content}`;
    //     const blob = new Blob([csvContent], { type: 'text/csv' });
    //     const url = URL.createObjectURL(blob);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.download = 'date_results.csv';
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     URL.revokeObjectURL(url);
    // }

    return (
        <ThemeProvider theme={purpleTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ 
                    height: '100vh', 
                    backgroundColor: 'background.default', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}>
                    <Paper elevation={3} sx={{ 
                        p: 4, 
                        maxWidth: 600, 
                        width: '100%', 
                        height: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Typography variant="h4" component="h1" gutterBottom align="center" color="primary">
                            Report Due Date Calculator
                        </Typography>
                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={errorCalendarType}>
                                    <InputLabel id="calendar-type-label">Calendar Type</InputLabel>
                                    <Select
                                        labelId="calendar-type-label"
                                        id="calendar-type"
                                        value={calendarType}
                                        label="Calendar Type"
                                        onChange={(event) => {
                                            setCalendarType(event.target.value);
                                            setErrorCalendarType(false);
                                        }}
                                    >
                                        <MenuItem value={"quarter"}>Quarter</MenuItem>
                                        <MenuItem value={"month"}>Month</MenuItem>
                                        <MenuItem value={"year"}>Year</MenuItem>
                                    </Select>
                                </FormControl>
                                <Box>
                                    {
                                        calendarType === 'year' && (
                                            <DatePicker 
                                                label={'Requirement date'}
                                                openTo="month"
                                                views={['month', 'day']}
                                                sx={{ width: '100%' }}
                                            />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Agreement Start Date"
                                    value={startDate}
                                    onChange={(date) => setStartDate(date)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Agreement End Date"
                                    value={endDate}
                                    onChange={(date) => setEndDate(date)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    id="requirement-days"
                                    label="Number of Days"
                                    type="number"
                                    fullWidth
                                    required
                                    error={errorReqDays}
                                    helperText={errorReqDays ? "Number of days should be greater than 0" : ""}
                                    onChange={(event) => {
                                        const v = parseInt(event.target.value);
                                        v <= 0 ? setErrorReqDays(true) : setErrorReqDays(false);
                                        setReqDays(v);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12} sm={4}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={handleCalculate}
                                    sx={{ py: 1.5 }}
                                >
                                    Calculate
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button 
                                    variant="outlined" 
                                    color="secondary" 
                                    fullWidth 
                                    onClick={handleClearResults}
                                    sx={{ py: 1.5 }}
                                >
                                    Clear Results
                                </Button>
                            </Grid>
                            {/* <Grid item xs={12} sm={4}>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={handleDownload}
                                    disabled={rangeResults.length === 0}
                                    sx={{ py: 1.5 }}
                                >
                                    Download
                                </Button>
                            </Grid> */}
                        </Grid>
                        <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                            <Paper elevation={5} sx={{ 
                                flexGrow: 1, 
                                overflow: 'auto', 
                                backgroundColor: 'secondary.light',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <List dense sx={{ flexGrow: 1 }}>
                                    {
                                        rangeResults.map((item, index) => (
                                            <ListItem key={index} divider={index !== rangeResults.length - 1}>
                                                <ListItemText
                                                    primary={dayjs(item).format('MM-DD-YYYY')}
                                                    sx={{ '& .MuiListItemText-primary': { fontSize: '1.25rem', p: 1 } }}
                                                />
                                            </ListItem>
                                        ))
                                    }
                                </List>
                            </Paper>
                        </Box>
                    </Paper>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}


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
    const [calendarType, setCalendarType] = useState('');

    const [yearSelect, setYearSelect] = useState(dayjs());

    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs());

    const [errorCalendarType, setErrorCalendarType] = useState(false);

    const [reqDays, setReqDays] = useState(0);
    const [errorReqDays, setErrorReqDays] = useState(false);

    const [rangeResults, setRangeResults] = useState([]);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const handleCalculate = () => {
        let isError = false;

        if (errorReqDays || !reqDays || Number.isNaN(reqDays)) {
            setErrorReqDays(true);
            isError = true;
        }

        if (!calendarType || (calendarType === 'year' && !yearSelect)) {
            setErrorCalendarType(true);
            isError = true;
        }

        if (isError) {
            return;
        }

        const ranges = generateDates(calendarType, startDate, endDate, reqDays, calendarType === 'year' ? yearSelect : null);

        setRangeResults(ranges);
    }

    const handleClearResults = () => {
        setRangeResults([]);
    }

    const handleDownload = () => {
        const header = "date";
        const content = rangeResults.map(date => dayjs(date).format('MM-DD-YYYY')).join('\n');
        const csvContent = `${header}\n${content}`;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'date_results.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

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
                        p: 3, 
                        maxWidth: 650, 
                        width: '100%', 
                        height: '97vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                            <Typography 
                                variant="h4" 
                                component="h1" 
                                gutterBottom align="center" 
                                color="primary"
                                sx={{ cursor: 'pointer', userSelect: 'none', transition: 'opacity 0.5s ease-in-out' }}
                                onClick={(e) => {
                                    const target = e.target as HTMLElement;
                                    if (target.innerText === 'Report Due Date Calculator') {
                                        target.style.opacity = '0';
                                        setTimeout(() => {
                                            target.innerText = 'Created by David Shubov';
                                            target.style.opacity = '1';
                                            setTimeout(() => {
                                                target.style.opacity = '0';
                                                setTimeout(() => {
                                                    target.innerText = 'Report Due Date Calculator';
                                                    target.style.opacity = '1';
                                                }, 500);
                                            }, 1000);
                                        }, 500);
                                    }
                                }}
                            >
                                Report Due Date Calculator
                            </Typography>
                        </Box>
                        <Grid container spacing={3} sx={{ mb: 2 }}>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={errorCalendarType}>
                                    <InputLabel id="calendar-type-label">Calendar Type</InputLabel>
                                    <Select
                                        labelId="calendar-type-label"
                                        id="calendar-type"
                                        value={calendarType}
                                        required
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
                                                label={'Fiscal Year End Date'}
                                                openTo="month"
                                                views={['month', 'day']}
                                                sx={{ width: '100%', marginTop: 2 }}
                                                value={yearSelect}
                                                onChange={(date) => setYearSelect(date)}
                                            />
                                    )}
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ pr: 1 }}>
                                <DatePicker
                                    label="Agreement Start Date"
                                    value={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    sx={{ width: '100%' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} sx={{ pl: 1 }}>
                                <DatePicker
                                    label="Agreement End Date"
                                    value={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    sx={{ width: '100%' }}
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
                                    helperText={errorReqDays ? "Must be greater than 0" : ""}
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
                            <Grid item xs={12} sm={4}>
                                <Button 
                                    variant="outlined" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={handleDownload}
                                    disabled={rangeResults.length === 0}
                                    sx={{ py: 1.5 }}
                                >
                                    Download CSV
                                </Button>
                            </Grid>
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
                                        rangeResults.length > 0 && (
                                                rangeResults.map((item, index) => (
                                                    <ListItem key={index} divider={index !== rangeResults.length - 1}>
                                                        <ListItemText
                                                            primary={dayjs(item).isValid() ? dayjs(item).format('MM-DD-YYYY') : 'Invalid result.'}
                                                            sx={{ '& .MuiListItemText-primary': { fontSize: '1.25rem', p: 1 } }}
                                                        />
                                                    </ListItem>
                                                ))
                                        )
                                    }
                                </List>
                            </Paper>
                        </Box>
                        {
                            rangeResults.length > 0 && (
                                <Button
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth 
                                    onClick={() => setShowFullScreen(true)}
                                    sx={{ py: 1.5, mt: 2 }}
                                >
                                    Full Screen Results
                                </Button>
                            )
                        }
                        {
                            showFullScreen && (
                                <Box sx={{ 
                                    position: 'fixed', 
                                    top: 0, 
                                    left: 0, 
                                    width: '100%', 
                                    height: '100%', 
                                    backgroundColor: 'background.default', 
                                    zIndex: 1300, 
                                    display: 'flex', 
                                    flexDirection: 'column' 
                                }}>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={() => setShowFullScreen(false)}
                                        sx={{ alignSelf: 'flex-end', m: 2 }}
                                    >
                                        Close
                                    </Button>
                                    <Paper elevation={5} sx={{ 
                                        flexGrow: 1, 
                                        overflow: 'auto', 
                                        backgroundColor: 'secondary.light',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        m: 2
                                    }}>
                                        <List dense sx={{ flexGrow: 1 }}>
                                            {
                                                rangeResults.length > 0 && (
                                                        rangeResults.map((item, index) => (
                                                            <ListItem key={index} divider={index !== rangeResults.length - 1}>
                                                                <ListItemText
                                                                    primary={dayjs(item).isValid() ? dayjs(item).format('MM-DD-YYYY') : 'Invalid result.'}
                                                                    sx={{ '& .MuiListItemText-primary': { fontSize: '1.25rem', p: 1 } }}
                                                                />
                                                            </ListItem>
                                                        ))
                                                )
                                            }
                                        </List>
                                    </Paper>
                                </Box>
                            )
                        }
                    </Paper>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}


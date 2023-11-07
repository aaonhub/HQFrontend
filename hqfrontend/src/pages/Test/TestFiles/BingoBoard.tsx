import React, { useState, useEffect } from 'react';
import { Button, TextareaAutosize, Grid, Paper } from '@mui/material';

const BingoBoard: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [board, setBoard] = useState<string[][]>([]);
    const [stamped, setStamped] = useState<boolean[][]>([]);
    const [showBoard, setShowBoard] = useState<boolean>(false);

    useEffect(() => {
        if (showBoard) {
            const items = inputText.split('\n').filter(item => item.trim() !== '');
            const randomizedItems = items.sort(() => 0.5 - Math.random());
            const boardSize = 5;

            let board: string[][] = [];
            let stamped: boolean[][] = [];

            for (let i = 0; i < boardSize; i++) {
                let row: string[] = [];
                let stampRow: boolean[] = [];

                for (let j = 0; j < boardSize; j++) {
                    if (i === 2 && j === 2) {
                        row.push('FREE');
                        stampRow.push(true);
                    } else {
                        row.push(randomizedItems.pop() || '');
                        stampRow.push(false);
                    }
                }
                board.push(row);
                stamped.push(stampRow);
            }

            setBoard(board);
            setStamped(stamped);
        }
    }, [showBoard, inputText]);

    const checkBingo = (): boolean => {
        for (let i = 0; i < 5; i++) {
            if (stamped[i].every(val => val)) return true;
            if (stamped.every(row => row[i])) return true;
        }
        if (stamped.every((row, idx) => row[idx])) return true;
        if (stamped.every((row, idx) => row[4 - idx])) return true;

        return false;
    };

    const handleStamp = (i: number, j: number) => {
        let newStamped = [...stamped];
        newStamped[i][j] = !newStamped[i][j];
        setStamped(newStamped);

        if (checkBingo()) {
            alert('Bingo!');
        }
    };

    return (
        <div style={{ width: '100%', padding: '1rem' }}>
            {!showBoard ? (
                <div>
                    <TextareaAutosize
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder="Enter your items separated by newline"
                        minRows={10}
                        style={{ width: '90%', fontSize: '1rem', color: 'black' }}
                    />
                    <br />
                    <Button variant="contained" color="primary" onClick={() => setShowBoard(true)} style={{ fontSize: '1rem', marginTop: '1rem' }}>
                        Submit
                    </Button>
                </div>
            ) : (
                <Grid container spacing={2}>
                    {board.map((row, i) => (
                        <Grid container item key={i} justifyContent="center">
                            {row.map((item, j) => (
                                <Grid item key={j} xs={2} md={2}>
                                    <Paper
                                        elevation={3}
                                        onClick={() => handleStamp(i, j)}
                                        style={{
                                            width: '80%',
                                            paddingTop: '10%',
                                            paddingBottom: '10%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: stamped[i][j] ? 'lightgray' : 'white',
                                            color: 'black',
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {item}
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default BingoBoard;

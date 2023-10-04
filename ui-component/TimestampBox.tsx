// components/TimestampBox.tsx
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TimestampBox: React.FC = () => {
    const [timestamp, setTimestamp] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimestamp(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            sx={{
                width: 250,
                height: 75,
                mt: 5,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #333',
                borderRadius: 2,
            }}
        >
            <Typography variant="h3">{timestamp}</Typography>
        </Box>
    );
};

export default TimestampBox;

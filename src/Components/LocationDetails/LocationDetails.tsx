import React, {FC, useContext} from "react";
import {AppContext} from "../../App";
import CardContent from '@mui/material/CardContent';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

interface LocationDetailsProps {}

export const LocationDetails: FC<LocationDetailsProps> = () => {
    const {selectedLocation} = useContext(AppContext);
    if (!selectedLocation) return null;

    return (
        <Card sx={{
            width: '20rem',
            margin: '10px',
            textAlign: 'start'
        }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    Selected Location
                </Typography>
                <Typography variant="h5" component="div">
                    <b>{selectedLocation?.capitalCity}</b>
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    <b>{selectedLocation?.country}</b>
                </Typography>
                <Typography variant="body2">
                    <span>Population: <b>{selectedLocation?.population?.toLocaleString()}</b></span>
                </Typography>
                <Typography variant="body2">
                    <span>Capital Type: <b>{selectedLocation?.capitalType}</b></span>
                </Typography>
            </CardContent>
        </Card>
    );
}

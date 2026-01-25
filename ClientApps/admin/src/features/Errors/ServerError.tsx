import { Button, Divider, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router";

export default function ServerError() {
    const {state} = useLocation();
    return (
    <Paper
        sx={{
            height: 400,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            p: 6,
            mt: 70
        }}>
            {state.error ? (
                <>
                    <Typography gutterBottom variant="h3" color='secondary' sx={{px: 4, pt: 2}}>
                        {state.error.message || 'There has been an error'}

                    </Typography>
                    <Divider/>
                    <Typography variant="body1" sx={{p:4}}>
                        {state.error?.details || 'Internal server error'}
                    </Typography>
                </>
            ) : (
                <Typography variant="h5">Server error</Typography>
            )}
            <Button fullWidth component={Link} to='/'>
                Return to Home Page
            </Button>
    </Paper>
  )
}
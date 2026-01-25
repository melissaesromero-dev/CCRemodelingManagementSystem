import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount } from "../../hooks/useAccount"
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { Alert, Box, Button, Container, Paper, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../SharedComponents/ReusableTextInput";
import { useLocation, useNavigate } from "react-router";

export default function LoginForm() {
    const {loginUser, loginError} = useAccount();
    const navigate = useNavigate();
    const location = useLocation();
    const {control, handleSubmit, formState: { isValid, isSubmitting }} = useForm<LoginSchema>({
        mode: 'onTouched',
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginSchema) => {
        try {
            await loginUser.mutateAsync(data);
            navigate(location.state?.from || '/mainDashboard')
        } catch (err) {
            console.error(err);
        }
    };

  return (
    <Container maxWidth="lg" sx={{ mt: 0, minHeight:"70vh" }}>
        <Box display={"flex"} w-100 justifyContent={"center"}>
            <Typography variant="h5">
                Customer and Service Request Management System 
            </Typography>
        </Box> 
        
    <Paper 
        component='form' 
        onSubmit={handleSubmit(onSubmit)}
        sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 3,
            mt: 3,
            gap: 3,
            maxWidth: 'sm',
            mx: 'auto',
            borderRadius: 3,
            border: 1,
            borderColor: 'lightgray'
        }}>
            <Box display='flex' alignItems='center' 
                 justifyContent='center' gap={3}
                 color='primary.main'
                 sx={{
                    }}>
                    <LockOpen fontSize="large"/>
                    <Typography variant="h4">Sign in</Typography>
                
            </Box>
            
            {/* Global login error from 401 */}
            {loginError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                {loginError}
                </Alert>
            )}

            <TextInput label='Email' control={control} name='email' />
            <TextInput label='Password' type="password" control={control} name='password' />

            <Button 
                type='submit'
                disabled = {!isValid || isSubmitting}
                variant="contained"
                size="large">
                    Login
                    
            </Button>
    </Paper>
    </Container>
  )
}
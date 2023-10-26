import { Box, Paper, Rating, Typography } from '@material-ui/core'
import user1 from '../../assets/images/user1.png'
import user2 from '../../assets/images/user2.png'
import user3 from '../../assets/images/user3.png'

const reviews = [
    {
        username: 'Meghan Smith',
        description:
            'Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.',
        point: 3,
        profilePicture: user1.src,
    },
    {
        username: 'Sam Row',
        description:
            'Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.',
        point: 4,
        profilePicture: user2.src,
    },
    {
        username: 'Andrew Shawn',
        description:
            'Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.',
        point: 5,
        profilePicture: user3.src,
    },
]

const Reviews = () => {
    return (
        <Box my="100px" sx={{ textAlign: 'center', paddingX: '130px' }}>
            <Typography variant="h3" sx={{ color: '#00624F', fontSize: '30px' }}>
                Reviews from our patient
            </Typography>
            <Typography mb={7} mt={3} variant="h5">
                Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are
                here for you.
            </Typography>

            <Box display="flex" alignItems="center" justifyContent="space-evenly" gap="16px">
                {reviews?.map((review, i) => (
                    <Paper key={i} elevation={2} sx={{ p: '16px' }}>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="16px">
                            <img src={review?.profilePicture} alt={review?.username} width="100px" height="100px" />
                            <Typography fontSize="24px" fontWeight="700" color="black">
                                {review?.username}
                            </Typography>
                            <Typography>{review?.description}</Typography>
                            <Rating value={review?.point} readOnly />
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Box>
    )
}

export default Reviews

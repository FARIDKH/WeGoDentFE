import { Box, Paper, Rating, Typography } from '@material-ui/core'
import user1 from '../../assets/images/user1.png'
import user2 from '../../assets/images/user2.png'
import user3 from '../../assets/images/user3.png'

const reviews = [
    {
        username: 'Tamas Kondor',
        description:
            'Legyen szó professzionális fogtisztításról, egy implantátum iránti érdeklődésről vagy egyszerű ellenőrzési időpont egyeztetésről - mi itt vagyunk Önnek.',
        point: 3,
        profilePicture: user2.src,
    },
    {
        username: 'Bergi Bernath',
        description:
            'Bármilyen fogászati gondja akad, akár sürgős segítségre van szüksége, csapatunk készen áll, hogy a legjobb ellátást nyújtsa',
        point: 4,
        profilePicture: user1.src,
    },
    {
        username: 'Gabor Bethlen',
        description:
            'A mosolya értékes számunkra, ezért minden erőfeszítést megteszünk annak érdekében, hogy a lehető legmagasabb minőségű kezelést kapja.',
        point: 5,
        profilePicture: user3.src,
    },
]

const Reviews = (curLang) => {
    const lang = curLang?.curLang
    return (
        <Box my="100px" sx={{ textAlign: 'center', paddingX: { xs: '20px', md: '130px' } }}>
            <Typography variant="h3" sx={{ color: '#00624F', fontSize: { xs: '20px', md: '30px' } }}>
                {lang == 'en' ? 'Reviews from our patient' : 'Vélemények a betegeinktől'}
            </Typography>
            <Typography mb={7} mt={3} variant="h5" sx={{ fontSize: { xs: '16px', sm: '18px' } }}>
                {lang == 'en'
                    ? 'Whether you need a professional teeth cleaning, are interested in an implant or simply want a check-up appointment - we are here for you.'
                    : 'Akár profi fogtisztításra van szüksége, implantátum iránt érdeklődik, vagy egyszerűen csak ellenőrző vizsgálatot szeretne - mi itt vagyunk Önnek.'}
            </Typography>

            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-evenly" gap="16px">
                {reviews?.map((review, i) => (
                    <Paper key={i} elevation={2} sx={{ p: '16px', width: { xs: '100%', md: 'auto' } }}>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="16px">
                            <img src={review?.profilePicture} alt={review?.username} style={{ width: '100px', height: '100px' }} />
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

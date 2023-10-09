import { Typography } from '@material-ui/core'
import React from 'react'
import MainLayout from '../../layout/admin/MainLayout'
import type { NextPage } from 'next';
import { Container } from '@mui/material';
import TimestampBox from '../../ui-component/TimestampBox';


import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Dashboard = () => {
    return (
        <MainLayout>
            <Typography variant="h3">Welcome Back</Typography>
            <Container
              maxWidth="xs"
              sx={{
                  display: 'flex',
                  height: '100vh',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
              }}
          >
              <TimestampBox />
          </Container>
        </MainLayout>
    )
}

export default Dashboard
export const getStaticProps = async ({ locale }) => {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["doctor"])),
      },
    };
  };
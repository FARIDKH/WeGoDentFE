import { Typography } from '@material-ui/core'
import React from 'react'
import MainLayout from '../../layout/admin/MainLayout'


import { serverSideTranslations } from "next-i18next/serverSideTranslations";


const Dashboard = () => {
    return (
        <MainLayout>
            <Typography variant="h3">Welcome Back</Typography>
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
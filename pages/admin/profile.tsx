import React, { useState } from 'react';
import { Button, ButtonGroup, CardContent, Typography } from '@material-ui/core'

import useUser from '../../lib/useUser'
import MainLayout from '../../layout/admin/MainLayout'
import MainCard from '../../ui-component/cards/MainCard'
import CurrentUser from '../../ui-component/CurrentUser'
import DescriptionGridGenerator from '../../ui-component/DescriptionGridGenerator'
import UpdateDoctor from '../../modules/Doctor/UpdateDoctor'
import UpdatePatient from '../../modules/patients/UpdatePatient'
import UpdateAccount from '../../modules/account/UpdateAccount'
// import UpdatePatient from '../../modules/mnager/CreateEdit'


import { serverSideTranslations } from 'next-i18next/serverSideTranslations'


const ProfilePage = () => {

    const { isDoctor, isPatient, isManager, info } = useUser()
    return (
        <CurrentUser>
            {({ info, isDoctor }) => {
                return (
                    <MainLayout>
                        <MainCard content={false}>
                            <CardContent>
                                {isDoctor && (<UpdateDoctor doctor={info}  />)}
                                {/* {isDoctor && (<UpdatePatient doctor={info}  />)} */}
                                {isPatient && (<UpdatePatient patient={info}  />)}
                                {isManager && (<UpdateAccount account={info}  />)}
                        

                            </CardContent>
                        </MainCard>
                    </MainLayout>
                )
            }}
        </CurrentUser>
    )
}

export default ProfilePage

export const getStaticProps = async ({ locale }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['doctor'])),
        },
    }
}


import { IconUsers, IconHome, IconCalendarEvent, IconBoxMultiple, IconNotes, IconPill } from '@tabler/icons'
import useUser from '../lib/useUser'
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next'



const icons = {
    IconDashboard: IconHome,
    IconUsers: IconUsers,
    IconAppointments: IconCalendarEvent,
    IconCategory: IconBoxMultiple,
    IconBlog: IconNotes,
    IconPill: IconPill
}

const useMenuItems = () => {
    const { isDoctor, isPatient, isAdmin, isBlogger } = useUser()

    const { t } = useTranslation('doctor');


    return [
        {
            id: 'main-menu',
            type: 'group',
            children: [
                {
                    id: 'dashboard',
                    title: t('labelMenuItemDashboard'),
                    type: 'item',
                    url: '/admin/dashboard',
                    icon: icons['IconDashboard'],
                    breadcrumbs: false,
                },
                {
                    id: 'appointments',
                    title: t('labelMenuItemAppointment'),
                    type: 'item',
                    url: '/admin/appointments',
                    icon: icons['IconAppointments'],
                    breadcrumbs: false,
                    hide: !isDoctor && !isPatient,
                },
                {
                    id: 'availabilities',
                    title: t('labelMenuItemAvailabilities'),
                    type: 'item',
                    url: '/admin/availabilities',
                    icon: icons['IconAppointments'],
                    breadcrumbs: false,
                    hide: !isDoctor,
                },
                {
                    id: 'patients',
                    title: t('labelMenuItemYourPatients'),
                    type: 'item',
                    url: '/admin/patients',
                    icon: icons['IconUsers'],
                    breadcrumbs: false,
                    hide: !isDoctor,
                },
                {
                    id: 'doctors',
                    title: 'Doctor List',
                    type: 'item',
                    url: '/admin/doctors',
                    icon: icons['IconUsers'],
                    breadcrumbs: false,
                    hide: !isAdmin,
                },
                {
                    id: 'treatments',
                    title: t('labelMenuItemAllTreatments'),
                    type: 'item',
                    url: '/admin/treatments',
                    icon: icons['IconPill'],
                    breadcrumbs: false,
                    hide: !isDoctor && !isAdmin,
                },
                {
                    id: 'blogs',
                    title: 'Blogs',
                    type: 'item',
                    url: '/admin/blogs',
                    icon: icons['IconBlog'],
                    breadcrumbs: false,
                    hide: !isAdmin && !isBlogger,
                },
                {
                    id: 'blogCategoriess',
                    title: 'Blog Categories',
                    type: 'item',
                    url: '/admin/blogs/categories',
                    icon: icons['IconCategory'],
                    breadcrumbs: false,
                    hide: !isAdmin && !isBlogger,
                },
            ],
        },
    ]
}

export default useMenuItems

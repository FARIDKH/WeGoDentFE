import { IconUsers, IconHome, IconCalendarEvent, IconBoxMultiple, IconNotes, IconPill } from '@tabler/icons'
import useUser from '../lib/useUser'

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

    console.log({ isDoctor, isPatient, isAdmin, isBlogger })

    return [
        {
            id: 'main-menu',
            type: 'group',
            children: [
                {
                    id: 'dashboard',
                    title: 'Dashboard',
                    type: 'item',
                    url: '/admin/dashboard',
                    icon: icons['IconDashboard'],
                    breadcrumbs: false,
                },
                {
                    id: 'appointments',
                    title: 'Appointments',
                    type: 'item',
                    url: '/admin/appointments',
                    icon: icons['IconAppointments'],
                    breadcrumbs: false,
                    hide: !isDoctor && !isPatient,
                },
                {
                    id: 'availabilities',
                    title: 'Availabilities',
                    type: 'item',
                    url: '/admin/availabilities',
                    icon: icons['IconAppointments'],
                    breadcrumbs: false,
                    hide: !isDoctor,
                },
                {
                    id: 'patients',
                    title: 'Your patients',
                    type: 'item',
                    url: '/admin/patients',
                    icon: icons['IconUsers'],
                    breadcrumbs: false,
                    hide: !isDoctor,
                },
                {
                    id: 'treatments',
                    title: 'All Treatments',
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

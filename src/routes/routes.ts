export interface Route {
    label: string,
    path: string,
    publicRoute: boolean
}

export const routes: Route [] = [
    {
        label: 'Home',
        path: '/',
        publicRoute: true
    },
    {
        label: 'Uploaded',
        path: '/uploaded',
        publicRoute: false
    }
];

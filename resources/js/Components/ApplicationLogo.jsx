import { usePage } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    const { asset_url } = usePage().props;
    return (
        <img {...props} src={`${asset_url}/1-no-bg.png`} alt="EcoTrack Logo" />
    );
}
